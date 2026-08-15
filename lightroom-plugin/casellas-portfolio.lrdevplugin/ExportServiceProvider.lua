-- Publish Service per a casellas.cat.
--
-- Crea una col·lecció de publicació per cada categoria del portfolio
-- (viatges, natura, astrofotografia, catalunya, concerts, tradicions,
-- sense-categoritzar). El nom de la col·lecció s'utilitza literalment (en
-- minúscules, espais convertits en guionets) com a nom de la subcarpeta
-- dins de originals/.
--
-- Subcategories: si la col·lecció és dins d'un Collection Set, el Cs
-- esdevé la categoria i la Co la subcategoria (llevat que es diguin igual,
-- cas en què són les fotos "arrel" de la categoria). Vegeu
-- resolveCategoryAndSubcategory més avall.
--
-- En publicar: exporta cada foto com a JPEG a originals/<categoria>/[<subcategoria>/]
-- i, si està activat, genera els fulls/thumbs en webp i publica a git — tot
-- en Lua pur (vegeu PortfolioSync.lua), sense passar per cap script bash/.bat.
-- En treure una foto de la col·lecció i tornar a publicar: esborra el fitxer
-- de originals/<categoria>/[<subcategoria>/] (Lightroom crida deletePhotosFromPublishedCollection).

local LrDialogs = import 'LrDialogs'
local LrFileUtils = import 'LrFileUtils'
local LrFunctionContext = import 'LrFunctionContext'
local LrHttp = import 'LrHttp'
local LrPathUtils = import 'LrPathUtils'
local LrTasks = import 'LrTasks'
local LrView = import 'LrView'

local PortfolioSync = dofile(LrPathUtils.child(_PLUGIN.path, 'PortfolioSync.lua'))

local exportServiceProvider = {}

exportServiceProvider.supportsIncrementalPublish = true
exportServiceProvider.canExportVideo = false

exportServiceProvider.titleForPublishedCollection = 'Categoria'
exportServiceProvider.titleForPublishedCollectionSet = 'Grup de categories'
exportServiceProvider.titleForGoToPublishedCollection = 'Mostra a la web'

exportServiceProvider.small_icon = 'icon.png'

exportServiceProvider.allowFileFormats = { 'JPEG' }
exportServiceProvider.allowColorSpaces = { 'sRGB', 'AdobeRGB', 'ProPhotoRGB' }

exportServiceProvider.hideSections = {
	'exportLocation',
	'fileNaming',
	'video',
}

-- Carpeta temporal on Lightroom renderitza abans que el plugin mogui els
-- fitxers cap a originals/<categoria>/.
local tempExportDir = LrPathUtils.child(LrPathUtils.getStandardFilePath('temp'), 'casellas-portfolio-publish')
LrFileUtils.createAllDirectories(tempExportDir)

-- Valors per defecte: cal ajustar-los al diàleg de configuració del servei la
-- primera vegada (Carpeta del repositori / Domini de la web).
local defaultRepoRoot = [[C:\ruta\al\teu\repositori]]
local defaultSiteDomain = 'el-teu-domini.cat'

-- Domini: es llegeix directament del fitxer CNAME del repo (la mateixa font
-- que fa servir GitHub Pages), així el plugin "agafa" el domini real de la
-- web en lloc de tenir-lo repetit i fix al codi. Si no el troba (p.ex. la
-- ruta encara no s'ha configurat), cau al placeholder.
local function readDefaultSiteDomain()
	local f = io.open(LrPathUtils.child(defaultRepoRoot, 'CNAME'), 'r')
	if not f then return defaultSiteDomain end
	local content = f:read('*a')
	f:close()
	local domain = content and content:match('%S+')
	return domain or defaultSiteDomain
end

exportServiceProvider.exportPresetFields = {
	{ key = 'repoRoot', default = defaultRepoRoot },
	{ key = 'siteDomain', default = readDefaultSiteDomain() },
	{ key = 'runSync', default = true },
	{ key = 'gitPublish', default = true },
	{ key = 'parallelWorkers', default = 0 },

	-- Configuració fixa de l'exportació (JPEG d'alta qualitat, sense retall).
	{ key = 'LR_format', default = 'JPEG' },
	{ key = 'LR_export_colorSpace', default = 'sRGB' },
	{ key = 'LR_jpeg_quality', default = 0.92 },
	{ key = 'LR_size_doConstrain', default = true },
	{ key = 'LR_size_resizeType', default = 'longEdge' },
	{ key = 'LR_size_maxHeight', default = 3600 },
	{ key = 'LR_size_maxWidth', default = 3600 },
	{ key = 'LR_outputSharpeningOn', default = false },
	{ key = 'LR_metadata_keywordOptions', default = 'lightroomHierarchical' },
	{ key = 'LR_embeddedMetadataOption', default = 'all' },
	{ key = 'LR_renamingTokensOn', default = false },
	{ key = 'LR_export_destinationType', default = 'specificFolder' },
	{ key = 'LR_export_destinationPathPrefix', default = tempExportDir },
	{ key = 'LR_export_useSubfolder', default = false },
	{ key = 'LR_collisionHandling', default = 'overwrite' },
	-- LR_useWatermark / LR_watermarking_id: gestionats per la secció
	-- "Watermarking" que ara es mostra al diàleg (vegeu hideSections).
}

-- Regenera els fulls/thumbs de TOTES les fotos ja presents a originals/ (no
-- només les publicades en aquesta sessió). Útil per aplicar canvis de
-- qualitat/mida del webp amb fotos ja existents, o si algun fitxer s'ha
-- malmès, sense haver de tornar a publicar-les una per una des de Lightroom.
local function runSyncAll(propertyTable)
	LrTasks.startAsyncTask(function()
		local confirmed = LrDialogs.confirm(
			'aGit@ — Sincronitza tot ara',
			"Això esborrarà PERMANENTMENT tota la carpeta src/images/portfolio/ i la regenerarà des de zero a partir "
				.. "de originals/ (recuperable via git si ja hi havia commit). Vols continuar?",
			'Continua',
			'Cancel·la'
		)
		if confirmed ~= 'ok' then return end

		LrFunctionContext.callWithContext('portfolioSyncAll', function(context)
			local progressScope = LrDialogs.showModalProgressDialog {
				title = 'aGit@ — Sincronitzant originals/',
				caption = 'Cercant fotos...',
				cannotCancel = false,
				functionContext = context,
			}

			local total, errors = PortfolioSync.syncAll(
				propertyTable.repoRoot,
				propertyTable.parallelWorkers,
				function(done, totalCount, filename)
					progressScope:setCaption(string.format('%d/%d — %s', done, totalCount, filename))
					if totalCount > 0 then
						progressScope:setPortionComplete(done, totalCount)
					end
				end
			)

			progressScope:done()

			if propertyTable.gitPublish then
				PortfolioSync.gitPublish(propertyTable.repoRoot)
			end

			LrDialogs.message(
				'aGit@',
				string.format("Sincronització completa: %d fotos processades, %d errors.\n\nRevisa scripts/lightroom-sync.log per al detall.", total, errors),
				errors > 0 and 'warning' or 'info'
			)
		end)
	end)
end

function exportServiceProvider.sectionsForTopOfDialog(f, propertyTable)
	return {
		{
			title = 'aGit@ — Sincronització amb originals/',

			f:row {
				f:static_text { title = 'Carpeta del repositori:', width = LrView.share('label_width') },
				f:edit_field { value = LrView.bind('repoRoot'), fill_horizontal = 1 },
			},
			f:row {
				f:static_text { title = 'Domini de la web:', width = LrView.share('label_width') },
				f:edit_field { value = LrView.bind('siteDomain'), fill_horizontal = 1 },
			},
			f:row {
				f:checkbox {
					title = "Genera fulls/thumbs (webp) en publicar",
					value = LrView.bind('runSync'),
				},
			},
			f:row {
				f:checkbox {
					title = "Publica a git en publicar",
					value = LrView.bind('gitPublish'),
				},
			},
			f:row {
				f:static_text { title = 'Processos en paral·lel:', width = LrView.share('label_width') },
				f:edit_field {
					value = LrView.bind('parallelWorkers'),
					min = 0,
					max = 64,
					precision = 0,
					width_in_chars = 4,
				},
				f:static_text { title = '(0 = automàtic: nuclis del processador × 2)' },
			},
			f:row {
				f:push_button {
					title = 'Sincronitza tot ara (originals/ → src/)',
					tooltip = "Esborra tot src/images/portfolio/ i el regenera des de zero a partir de totes les fotos "
						.. "ja presents a originals/, sense tornar a publicar-les des de Lightroom.",
					action = function() runSyncAll(propertyTable) end,
				},
			},
			f:row {
				f:static_text {
					fill_horizontal = 1,
					width_in_chars = 60,
					height_in_lines = 5,
					title = "El nom de cada col·lecció de publicació esdevé directament la categoria: "
						.. "s'utilitza tal qual (en minúscules, espais convertits en guionets) com a "
						.. "subcarpeta de originals/. No cal crear-la abans — es genera sola en publicar. "
							.. "Per subcategories: posa la col·lecció dins d'un Collection Set (el Set és la "
							.. "categoria, la col·lecció la subcategoria); una col·lecció amb el mateix nom "
							.. "que el Set publica les fotos \"arrel\" de la categoria.",
				},
			},
		},
	}
end

local function categoryFromCollectionName(name)
	return (name or ''):lower():gsub('%s+', '-')
end

-- Si la col·lecció de publicació és dins d'un Collection Set, el Cs és la
-- categoria i la Co la subcategoria (tret que es diguin igual, cas en què
-- són les fotos "arrel" de la categoria i no hi ha subcategoria). Si no té
-- Collection Set pare, la Co mateixa és la categoria (comportament pla,
-- sense subcategories).
local function resolveCategoryAndSubcategory(publishedCollection, collectionName)
	local ownSlug = categoryFromCollectionName(collectionName)

	local parent = nil
	if publishedCollection and publishedCollection.getParent then
		local ok, result = LrTasks.pcall(function() return publishedCollection:getParent() end)
		if ok then parent = result end
	end

	if not parent or not parent.getName then
		return ownSlug, nil
	end

	local parentSlug = categoryFromCollectionName(parent:getName())
	if parentSlug == ownSlug then
		return ownSlug, nil
	end
	return parentSlug, ownSlug
end

-- Deriva categoria/subcategoria del propi camí de l'original ja publicat
-- (originals/<categoria>/[<subcategoria>/]<fitxer>), sense necessitat de
-- l'objecte de col·lecció de Lightroom (deletePhotosFromPublishedCollection
-- no en rep cap referència fiable).
local function categoryAndSubcategoryFromPath(photoId)
	local dir = LrPathUtils.parent(photoId)
	local dirName = dir and LrPathUtils.leafName(dir)
	local grandDir = dir and LrPathUtils.parent(dir)
	local grandName = grandDir and LrPathUtils.leafName(grandDir)

	if grandName == 'originals' then
		return dirName, nil
	end
	return grandName, dirName
end

function exportServiceProvider.goToPublishedCollection(publishSettings, info)
	local collectionName = info.publishedCollectionInfo and info.publishedCollectionInfo.name
	local category, subcategory = resolveCategoryAndSubcategory(info.publishedCollection, collectionName)
	local domain = publishSettings.siteDomain or defaultSiteDomain
	local url = 'https://' .. domain .. '/photos/' .. category .. '/'
	if subcategory then url = url .. subcategory .. '/' end
	LrHttp.openUrlInBrowser(url)
end

function exportServiceProvider.processRenderedPhotos(functionContext, exportContext)
	local exportSettings = assert(exportContext.propertyTable)
	local collectionInfo = exportContext.publishedCollectionInfo
	local collectionName = collectionInfo and collectionInfo.name

	if not collectionName then
		LrDialogs.message(
			'aGit@',
			"Aquest plugin només funciona publicant des d'una col·lecció de publicació (una per categoria).",
			'critical'
		)
		return
	end

	local category, subcategory = resolveCategoryAndSubcategory(exportContext.publishedCollection, collectionName)
	local targetDir = LrPathUtils.child(LrPathUtils.child(exportSettings.repoRoot, 'originals'), category)
	if subcategory then targetDir = LrPathUtils.child(targetDir, subcategory) end
	LrFileUtils.createAllDirectories(targetDir)

	local renderedPaths = {}

	for _, rendition in exportContext:renditions { stopIfCanceled = true } do
		local success, pathOrMessage = rendition:waitForRender()
		if success then
			local filename = LrPathUtils.leafName(pathOrMessage)
			local finalPath = LrPathUtils.child(targetDir, filename)

			if LrFileUtils.exists(finalPath) then
				LrFileUtils.delete(finalPath)
			end
			LrFileUtils.move(pathOrMessage, finalPath)

			rendition:recordPublishedPhotoId(finalPath)
			table.insert(renderedPaths, finalPath)
		else
			LrDialogs.message('aGit@', 'Error exportant una foto: ' .. tostring(pathOrMessage), 'critical')
		end
	end

	if #renderedPaths == 0 then return end

	-- Es crida directament (sense LrTasks.startAsyncTask): processRenderedPhotos
	-- ja s'executa dins d'un context que admet yield (per això
	-- rendition:waitForRender(), més amunt, ja funciona sense embolcallar-la).
	-- Cal que la funció NO torni fins que la sincronització i el git publish
	-- hagin acabat de debò: si es desacobla en una tasca a part, Lightroom dona
	-- la publicació per feta (barra de "Updating published collections" salta
	-- a 100%) mentre la feina real encara corre en segon pla, invisible.
	local progressScope = exportContext:configureProgress { title = 'aGit@ — Generant fulls/thumbs' }

	if exportSettings.runSync then
		local jobs = {}
		for _, path in ipairs(renderedPaths) do
			table.insert(jobs, { path = path, category = category, subcategory = subcategory })
		end
		PortfolioSync.generateMany(exportSettings.repoRoot, jobs, exportSettings.parallelWorkers, function(done, total, filename)
			progressScope:setCaption(string.format('%d/%d — %s', done, total, filename))
			if total > 0 then
				progressScope:setPortionComplete(done, total)
			end
		end)
	end

	if exportSettings.gitPublish then
		progressScope:setCaption('Publicant a git...')
		PortfolioSync.gitPublish(exportSettings.repoRoot)
	end

	progressScope:done()
end

function exportServiceProvider.deletePhotosFromPublishedCollection(publishSettings, arrayOfPhotoIds, deletedCallback)
	local deletedPhotoIds = {}

	for _, photoId in ipairs(arrayOfPhotoIds) do
		if LrFileUtils.exists(photoId) then
			LrFileUtils.delete(photoId)
		end
		table.insert(deletedPhotoIds, photoId)
		deletedCallback(photoId)
	end

	if #deletedPhotoIds == 0 then return end

	LrTasks.startAsyncTask(function()
		if publishSettings.runSync then
			for _, photoId in ipairs(deletedPhotoIds) do
				local category, subcategory = categoryAndSubcategoryFromPath(photoId)
				PortfolioSync.deleteForPhoto(publishSettings.repoRoot, category, LrPathUtils.leafName(photoId), subcategory)
			end
		end
		if publishSettings.gitPublish then
			PortfolioSync.gitPublish(publishSettings.repoRoot)
		end
	end, 'aGit@ — sync portfolio (delete)')
end

return exportServiceProvider
