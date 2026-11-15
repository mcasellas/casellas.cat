-- Publish Service per a casellas.cat.
--
-- Crea una col·lecció de publicació per cada categoria del portfolio
-- (viatges, natura, astrofotografia, catalunya, concerts, tradicions,
-- sense_categoritzar). El nom de la col·lecció s'utilitza literalment (en
-- minúscules, espais convertits en _ ; els guions es mantenen) com a nom de la subcarpeta
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
-- En renombrar/moure una col·lecció o Set: les seves fotos es marquen per tornar
-- a publicar, i en publicar es mouen a la carpeta nova i s'esborra la vella.
-- En esborrar una col·lecció: s'esborren els seus originals i webp.

local LrApplication = import 'LrApplication'
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
	return (PortfolioSync.foldCase(name):gsub('%s+', '_'))
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

-- Clau que identifica el parell fulls/thumbs d'una foto (els webp es
-- nomenen per cleanStem, així que "_MCM1.jpg" i "MCM1.jpg" comparteixen webp).
local function webpKey(category, subcategory, filename)
	return PortfolioSync.foldCase(category .. '/' .. (subcategory or '') .. '/' .. PortfolioSync.cleanStem(filename))
end

-- Esborra de disc els originals publicats `photoIds` (camins a originals/),
-- els seus webp (si runSync) i les carpetes que quedin buides. Els webp amb
-- clau dins de `keepWebpKeys` es conserven (els acaba de generar una foto nova
-- amb el mateix nom net). S'ha de cridar dins d'una async task.
local function removePublishedFiles(publishSettings, photoIds, keepWebpKeys)
	local originalsRoot = LrPathUtils.child(publishSettings.repoRoot, 'originals')
	for _, photoId in ipairs(photoIds) do
		if LrFileUtils.exists(photoId) then
			LrFileUtils.delete(photoId)
		end
		PortfolioSync.removeEmptyDirs(LrPathUtils.parent(photoId), originalsRoot)

		if publishSettings.runSync then
			local category, subcategory = categoryAndSubcategoryFromPath(photoId)
			local filename = LrPathUtils.leafName(photoId)
			if category and not (keepWebpKeys and keepWebpKeys[webpKey(category, subcategory, filename)]) then
				PortfolioSync.deleteForPhoto(publishSettings.repoRoot, category, filename, subcategory)
			end
		end
	end
end

-- Totes les col·leccions de publicació sota `node` (ell mateix si és una
-- col·lecció; els fills recursivament si és un Collection Set).
local function collectPublishedCollections(node, out)
	out = out or {}
	if not node then return out end
	if node.getChildCollections then
		for _, c in ipairs(node:getChildCollections() or {}) do collectPublishedCollections(c, out) end
		for _, s in ipairs(node:getChildCollectionSets() or {}) do collectPublishedCollections(s, out) end
	elseif node.getPublishedPhotos then
		table.insert(out, node)
	end
	return out
end

-- En renombrar o moure una col·lecció (o un Collection Set) canvia la carpeta
-- de destí de totes les seves fotos, però Lightroom no les torna a publicar
-- per si sol. Es marquen com a "modificades": en clicar Publica,
-- processRenderedPhotos les escriu a la carpeta nova i esborra les velles
-- (vegeu `stale` allà). Es fa així, i no movent els fitxers ara, perquè en
-- aquest moment Lightroom encara no ha aplicat el canvi de nom/pare i el
-- destí final només és fiable en publicar.
local function markForRepublish(node, label)
	LrTasks.startAsyncTask(function()
		-- Petita espera perquè Lightroom acabi la seva pròpia escriptura al
		-- catàleg (el canvi de nom) abans de demanar-ne l'accés.
		LrTasks.sleep(0.5)
		local collections = collectPublishedCollections(node)
		local count = 0
		local ok, err = LrTasks.pcall(function()
			LrApplication.activeCatalog():withWriteAccessDo('aGit@ — marca fotos per tornar a publicar', function()
				for _, c in ipairs(collections) do
					for _, publishedPhoto in ipairs(c:getPublishedPhotos() or {}) do
						publishedPhoto:setEditedFlag(true)
						count = count + 1
					end
				end
			end, { timeout = 60 })
		end)

		if not ok then
			LrDialogs.message(
				'aGit@',
				"No s'han pogut marcar les fotos de «" .. tostring(label) .. "» per tornar a publicar ("
					.. tostring(err) .. ").\n\nMarca-les a mà (botó dret → Marca per tornar a publicar) "
					.. "i publica, o quedaran a la carpeta antiga.",
				'warning'
			)
		elseif count > 0 then
			LrDialogs.message(
				'aGit@',
				string.format(
					"«%s»: %d fotos marcades per tornar a publicar.\n\nClica Publica perquè passin a la carpeta "
						.. "nova; l'antiga s'esborrarà automàticament. Fins llavors la web continua amb el nom vell.",
					tostring(label), count
				),
				'info'
			)
		end
	end, 'aGit@ — marca per tornar a publicar')
end

function exportServiceProvider.renamePublishedCollection(publishSettings, info)
	markForRepublish(info.publishedCollection, info.name)
end

function exportServiceProvider.reparentPublishedCollection(publishSettings, info)
	markForRepublish(info.publishedCollection, info.name)
end

-- Esborrar una col·lecció (o un Set) de publicació: Lightroom NO crida
-- deletePhotosFromPublishedCollection, així que cal esborrar aquí els
-- originals i webp de totes les seves fotos.
function exportServiceProvider.deletePublishedCollection(publishSettings, info)
	local photoIds = {}
	for _, c in ipairs(collectPublishedCollections(info.publishedCollection)) do
		for _, publishedPhoto in ipairs(c:getPublishedPhotos() or {}) do
			local remoteId = publishedPhoto:getRemoteId()
			if remoteId then table.insert(photoIds, remoteId) end
		end
	end
	if #photoIds == 0 then return end

	LrTasks.startAsyncTask(function()
		removePublishedFiles(publishSettings, photoIds)
		if publishSettings.gitPublish then
			PortfolioSync.gitPublish(publishSettings.repoRoot)
		end
	end, 'aGit@ — esborra col·lecció')
end

function exportServiceProvider.goToPublishedCollection(publishSettings, info)
	local collectionName = info.publishedCollectionInfo and info.publishedCollectionInfo.name
	local category, subcategory = resolveCategoryAndSubcategory(info.publishedCollection, collectionName)
	local domain = publishSettings.siteDomain or defaultSiteDomain
	-- A la URL els _ de la carpeta es mostren com a -.
	local url = 'https://' .. domain .. '/photos/' .. category:gsub('_', '-') .. '/'
	if subcategory then url = url .. subcategory:gsub('_', '-') .. '/' end
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

	-- La foto NO es marca com a publicada (recordPublishedPhotoId) fins que
	-- els webp s'han generat bé: si magick falla, es crida uploadFailed i
	-- Lightroom la deixa a "Pendents de publicar" i mostra l'error.
	local jobs = {}

	for _, rendition in exportContext:renditions { stopIfCanceled = true } do
		local success, pathOrMessage = rendition:waitForRender()
		if success then
			local filename = LrPathUtils.leafName(pathOrMessage)
			local finalPath = LrPathUtils.child(targetDir, filename)

			if LrFileUtils.exists(finalPath) then
				LrFileUtils.delete(finalPath)
			end
			LrFileUtils.move(pathOrMessage, finalPath)

			table.insert(jobs, {
				rendition = rendition,
				path = finalPath,
				category = category,
				subcategory = subcategory,
			})
		else
			rendition:uploadFailed('Error exportant la foto: ' .. tostring(pathOrMessage))
		end
	end

	if #jobs == 0 then return end

	-- Es crida directament (sense LrTasks.startAsyncTask): processRenderedPhotos
	-- ja s'executa dins d'un context que admet yield (per això
	-- rendition:waitForRender(), més amunt, ja funciona sense embolcallar-la).
	-- Cal que la funció NO torni fins que la sincronització i el git publish
	-- hagin acabat de debò: si es desacobla en una tasca a part, Lightroom dona
	-- la publicació per feta (barra de "Updating published collections" salta
	-- a 100%) mentre la feina real encara corre en segon pla, invisible.
	local progressScope = exportContext:configureProgress { title = 'aGit@ — Generant fulls/thumbs' }

	if exportSettings.runSync then
		PortfolioSync.generateMany(exportSettings.repoRoot, jobs, exportSettings.parallelWorkers, function(done, total, filename)
			progressScope:setCaption(string.format('%d/%d — %s', done, total, filename))
			if total > 0 then
				progressScope:setPortionComplete(done, total)
			end
		end)
	end

	for _, job in ipairs(jobs) do
		if job.ok or not exportSettings.runSync then
			job.rendition:recordPublishedPhotoId(job.path)
		else
			-- Si la foto no s'havia publicat mai, es treu l'original acabat de
			-- copiar: si no, quedaria orfe a originals/ (i "Sincronitza tot" la
			-- publicaria) encara que després es tregui de la col·lecció.
			-- Si ja estava publicada, es deixa: els webp anteriors segueixen vàlids.
			-- (Si abans era en un altre camí — col·lecció renombrada — la còpia
			-- nova també és òrfena: l'antiga continua sent la publicada.)
			local previous = job.rendition.publishedPhotoId
			local isNewPath = not previous or PortfolioSync.foldCase(previous) ~= PortfolioSync.foldCase(job.path)
			if isNewPath and LrFileUtils.exists(job.path) then
				LrFileUtils.delete(job.path)
			end
			job.rendition:uploadFailed("No s'ha pogut generar el webp. Revisa scripts/lightroom-sync.log.")
		end
	end

	-- Fotos que abans estaven publicades en un altre camí (col·lecció
	-- renombrada o moguda a un altre Set, o el nom del fitxer ha canviat):
	-- s'esborren l'original i els webp vells perquè no quedin duplicats a la web.
	local newPaths, newKeys, stale = {}, {}, {}
	for _, job in ipairs(jobs) do
		newPaths[PortfolioSync.foldCase(job.path)] = true
		newKeys[webpKey(job.category, job.subcategory, LrPathUtils.leafName(job.path))] = true
	end
	for _, job in ipairs(jobs) do
		local previous = job.rendition.publishedPhotoId
		if (job.ok or not exportSettings.runSync) and previous and not newPaths[PortfolioSync.foldCase(previous)] then
			table.insert(stale, previous)
		end
	end
	if #stale > 0 then
		progressScope:setCaption('Esborrant les còpies de la carpeta antiga...')
		removePublishedFiles(exportSettings, stale, newKeys)
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
		table.insert(deletedPhotoIds, photoId)
		deletedCallback(photoId)
	end

	if #deletedPhotoIds == 0 then return end

	LrTasks.startAsyncTask(function()
		removePublishedFiles(publishSettings, deletedPhotoIds)
		if publishSettings.gitPublish then
			PortfolioSync.gitPublish(publishSettings.repoRoot)
		end
	end, 'aGit@ — sync portfolio (delete)')
end

return exportServiceProvider
