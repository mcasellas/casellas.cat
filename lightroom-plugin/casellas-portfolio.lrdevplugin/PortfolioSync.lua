-- Sincronització pura Lua (sense bash/.bat) del portfolio.
--
-- Genera els .webp de fulls/ i thumbs/ a partir de l'original JPEG exportat
-- a originals/<categoria>/, i publica els canvis a git. Totes les crides a
-- processos externs (magick, git) es fan amb LrTasks.execute començant pel
-- nom de l'executable SENSE cometes (es confia en el PATH): així s'evita el
-- bug de cmd.exe on, si el primer token de la línia també va entre cometes
-- i n'hi ha d'altres després, la quotació es trenca.
--
-- Cal tenir "magick" (ImageMagick) i "git" al PATH del sistema.

local LrDialogs = import 'LrDialogs'
local LrFileUtils = import 'LrFileUtils'
local LrPathUtils = import 'LrPathUtils'
local LrTasks = import 'LrTasks'

local PortfolioSync = {}

local function logPath(repoRoot)
	return LrPathUtils.child(LrPathUtils.child(repoRoot, 'scripts'), 'lightroom-sync.log')
end

local function appendLog(repoRoot, line)
	local f = io.open(logPath(repoRoot), 'a')
	if not f then return end
	f:write(os.date('%Y-%m-%d %H:%M:%S') .. '  ' .. line .. '\n')
	f:close()
end

-- Executa una comanda dins del task actual (cal cridar-ho des d'un
-- LrTasks.startAsyncTask) i retorna el codi de sortida (o nil si ha fallat
-- la pròpia invocació).
local function execute(cmd)
	local ok, result = LrTasks.pcall(LrTasks.execute, cmd)
	if not ok then return nil, result end
	return result
end

local function child(base, ...)
	local path = base
	for _, part in ipairs({ ... }) do
		path = LrPathUtils.child(path, part)
	end
	return path
end

-- Treu caràcters _- inicials i l'extensió del nom de fitxer, deixant el nom
-- "net" comú a l'original i als fitxers full/thumb generats.
local function cleanStem(filename)
	local stem = filename:gsub('%.[^.]+$', '')
	stem = stem:gsub('^[_%-]+', '')
	return stem
end

-- subcategory pot ser nil (categoria "arrel", sense subcarpeta extra).
local function categoryDirs(repoRoot, category, subcategory)
	local base = child(repoRoot, 'src', 'images', 'portfolio', category)
	local fulls = LrPathUtils.child(base, 'fulls')
	local thumbs = LrPathUtils.child(base, 'thumbs')
	if subcategory then
		fulls = LrPathUtils.child(fulls, subcategory)
		thumbs = LrPathUtils.child(thumbs, subcategory)
	end
	return { fulls = fulls, thumbs = thumbs }
end

local function labelFor(category, subcategory)
	if subcategory then return category .. '/' .. subcategory end
	return category
end

-- Genera fulls/<stem>.webp i thumbs/<stem>.webp a partir de l'original ja
-- copiat a originals/<categoria>/[<subcategoria>/]. S'ha de cridar dins
-- d'una async task.
function PortfolioSync.generateForPhoto(repoRoot, category, origPath, subcategory)
	local filename = LrPathUtils.leafName(origPath)
	local stem = cleanStem(filename)
	local label = labelFor(category, subcategory)
	local dirs = categoryDirs(repoRoot, category, subcategory)
	LrFileUtils.createAllDirectories(dirs.fulls)
	LrFileUtils.createAllDirectories(dirs.thumbs)

	local full = LrPathUtils.child(dirs.fulls, stem .. '.webp')
	local thumb = LrPathUtils.child(dirs.thumbs, stem .. '.webp')

	execute(string.format('magick "%s" -quality 75 "%s"', origPath, full))
	execute(string.format('magick "%s" -quality 60 -resize "580x580>" -strip "%s"', origPath, thumb))

	if not LrFileUtils.exists(full) or not LrFileUtils.exists(thumb) then
		appendLog(repoRoot, string.format('ERROR generant %s (%s)', stem, label))
		LrDialogs.message(
			'aGit@',
			string.format("No s'ha pogut generar el webp per a '%s' (%s). Revisa que 'magick' sigui al PATH.", stem, label),
			'warning'
		)
		return false
	end

	appendLog(repoRoot, string.format('Generat %s (%s)', stem, label))
	return true
end

-- Esborra fulls/<stem>.webp i thumbs/<stem>.webp corresponents a un
-- original que s'ha tret de la col·lecció de publicació.
function PortfolioSync.deleteForPhoto(repoRoot, category, filename, subcategory)
	local stem = cleanStem(filename)
	local label = labelFor(category, subcategory)
	local dirs = categoryDirs(repoRoot, category, subcategory)
	local full = LrPathUtils.child(dirs.fulls, stem .. '.webp')
	local thumb = LrPathUtils.child(dirs.thumbs, stem .. '.webp')

	if LrFileUtils.exists(full) then LrFileUtils.delete(full) end
	if LrFileUtils.exists(thumb) then LrFileUtils.delete(thumb) end

	appendLog(repoRoot, string.format('Eliminat %s (%s)', stem, label))
end

-- Recorre recursivament originals/ recollint cada JPEG trobat, junt amb la
-- seva ruta relativa (categoria[/subcategoria]) respecte a originals/.
local function collectOriginals(dir, relDir, out)
	for entry in LrFileUtils.directoryEntries(dir) do
		local kind = LrFileUtils.exists(entry)
		local leaf = LrPathUtils.leafName(entry)
		if kind == 'directory' then
			collectOriginals(entry, relDir == '' and leaf or (relDir .. '/' .. leaf), out)
		elseif kind == 'file' then
			local ext = LrPathUtils.extension(entry):lower()
			if ext == 'jpg' or ext == 'jpeg' then
				table.insert(out, { path = entry, relDir = relDir })
			end
		end
	end
end

-- Detecta el nombre de nuclis lògics del processador via la variable
-- d'entorn de Windows NUMBER_OF_PROCESSORS. Si no es pot llegir (p. ex.
-- os.getenv no disponible, o no és Windows), cau a 4 com a valor raonable.
local function detectCpuCount()
	local ok, raw = pcall(function() return os.getenv('NUMBER_OF_PROCESSORS') end)
	local n = ok and tonumber(raw)
	return n or 4
end

-- Nombre de workers per al mode "automàtic" (workerCount <= 0). Cada worker
-- passa bona part del temps esperant E/S de disc (llegir el JPEG, escriure
-- els webp) més que fent càlcul pur, així que la CPU sovint no se satura
-- amb un worker per nucli — es multiplica per 2 per aprofitar-la millor.
local function detectAutoWorkerCount()
	return detectCpuCount() * 2
end

-- Reparteix `list` en `n` trossos de manera round-robin, preservant l'ordre
-- relatiu dins de cada tros.
local function splitIntoChunks(list, n)
	local chunks = {}
	for i = 1, n do chunks[i] = {} end
	for i, item in ipairs(list) do
		local idx = ((i - 1) % n) + 1
		table.insert(chunks[idx], item)
	end
	return chunks
end

-- Esborra recursivament un fitxer o directori. LrFileUtils.delete només
-- admet fitxers o directoris ja buits (no baixa recursivament ell sol), i
-- LrFileUtils.moveToTrash no gestiona bé directoris no buits — per això cal
-- baixar manualment fins a les fulles i esborrar de baix a dalt. Retorna
-- true si tot s'ha pogut esborrar.
local function deleteTree(path)
	local kind = LrFileUtils.exists(path)
	if kind == 'file' then
		return LrFileUtils.delete(path)
	end
	if kind ~= 'directory' then
		return true
	end

	local ok = true
	for entry in LrFileUtils.directoryEntries(path) do
		if not deleteTree(entry) then ok = false end
	end
	if not LrFileUtils.delete(path) then ok = false end
	return ok
end

-- Genera fulls/thumbs per a una llista de fotos ({ path, category,
-- subcategory }), repartint la feina en `workerCount` tasques concurrents
-- (workerCount <= 0 vol dir "detecta automàticament els nuclis del
-- processador"): cada LrTasks.execute cedeix el control mentre `magick`
-- corre, així que diverses tasques poden tenir el seu propi procés `magick`
-- corrent alhora de debò. Reutilitzat tant per syncAll (totes les fotos
-- d'originals/) com per processRenderedPhotos (les fotos d'una publicació).
--
-- progressCallback(done, total, filename) és opcional. S'ha de cridar dins
-- d'una async task. Retorna (total, errors, workerCount efectiu).
function PortfolioSync.generateMany(repoRoot, photos, workerCount, progressCallback)
	if #photos == 0 then return 0, 0, 0 end

	if not workerCount or workerCount <= 0 then
		workerCount = detectAutoWorkerCount()
	end
	workerCount = math.max(1, math.min(workerCount, #photos))

	local chunks = splitIntoChunks(photos, workerCount)
	local doneCount, errorCount, finishedWorkers = 0, 0, 0

	for _, chunk in ipairs(chunks) do
		LrTasks.startAsyncTask(function()
			for _, photo in ipairs(chunk) do
				local ok = PortfolioSync.generateForPhoto(repoRoot, photo.category, photo.path, photo.subcategory)
				doneCount = doneCount + 1
				if not ok then errorCount = errorCount + 1 end
				if progressCallback then progressCallback(doneCount, #photos, LrPathUtils.leafName(photo.path)) end
			end
			finishedWorkers = finishedWorkers + 1
		end)
	end

	while finishedWorkers < #chunks do
		LrTasks.sleep(0.1)
	end

	return #photos, errorCount, workerCount
end

-- Regenera fulls/thumbs per a TOTES les fotos ja presents a originals/,
-- sense necessitat de tornar a publicar-les des de Lightroom (útil després
-- de canviar la qualitat/mida del webp, o si algun fitxer s'ha malmès).
--
-- Esborra tot src/images/portfolio/ abans de començar: així no queden webp
-- orfes si algun original s'ha esborrat/renombrat a mà (sense passar pel
-- plugin). L'esborrat és permanent al disc (recuperable via git si ja
-- s'havia fet commit).
--
-- progressCallback(done, total, filename) és opcional. S'ha de cridar dins
-- d'una async task. Retorna (total, errors).
function PortfolioSync.syncAll(repoRoot, workerCount, progressCallback)
	local destRoot = child(repoRoot, 'src', 'images', 'portfolio')
	if LrFileUtils.exists(destRoot) then
		if not deleteTree(destRoot) then
			appendLog(repoRoot, "AVÍS: no s'ha pogut esborrar completament src/images/portfolio/ abans de regenerar.")
		end
	end

	local originalsRoot = LrPathUtils.child(repoRoot, 'originals')
	local rawPhotos = {}
	collectOriginals(originalsRoot, '', rawPhotos)

	local photos = {}
	for _, photo in ipairs(rawPhotos) do
		local category, subcategory = photo.relDir, nil
		local sep = photo.relDir:find('/')
		if sep then
			category = photo.relDir:sub(1, sep - 1)
			subcategory = photo.relDir:sub(sep + 1)
			-- Igual que a resolveCategoryAndSubcategory (ExportServiceProvider.lua):
			-- si la subcarpeta es diu igual que la categoria, són les fotos "arrel"
			-- de la categoria, no una subcategoria real.
			if subcategory == category then subcategory = nil end
		end
		table.insert(photos, { path = photo.path, category = category, subcategory = subcategory })
	end

	local total, errors, effectiveWorkers = PortfolioSync.generateMany(repoRoot, photos, workerCount, progressCallback)

	appendLog(repoRoot, string.format(
		'Sincronització completa: %d fotos, %d errors (workers=%d).', total, errors, effectiveWorkers
	))
	return total, errors
end

-- Lightroom pot cridar processRenderedPhotos/deletePhotosFromPublishedCollection
-- per a diverses col·leccions gairebé alhora (p.ex. "Publish All", o movent
-- una foto d'una categoria a una altra: la col·lecció d'origen rep un delete
-- i la de destí un publish, en paral·lel). Cada crida acaba fent el seu propi
-- gitPublish en una async task independent; sense serialitzar-les, dos
-- "git add/commit/push" concurrents poden xocar (index.lock, o un push
-- rebutjat perquè l'altre ja ha avançat origin). Aquest lock (variable
-- d'àmbit de mòdul, compartida per totes les tasques dins del mateix plugin)
-- fa que s'executin d'una en una.
local gitBusy = false

local function withGitLock(fn)
	while gitBusy do
		LrTasks.sleep(0.5)
	end
	gitBusy = true
	local ok, err = LrTasks.pcall(fn)
	gitBusy = false
	if not ok then error(err) end
end

-- Fa git add/commit/push dels canvis a src/images/portfolio/. S'ha de
-- cridar dins d'una async task. Serialitzat amb withGitLock per si diverses
-- col·leccions es publiquen/esborren alhora.
function PortfolioSync.gitPublish(repoRoot)
	withGitLock(function()
		local portfolioRel = 'src/images/portfolio'

		execute(string.format('git -C "%s" add -- "%s"', repoRoot, portfolioRel))

		-- "git diff --cached --quiet" surt amb 0 si NO hi ha canvis, 1 si n'hi ha.
		local diffExit = execute(string.format('git -C "%s" diff --cached --quiet -- "%s"', repoRoot, portfolioRel))
		if diffExit == 0 then
			appendLog(repoRoot, 'Cap canvi a git; no es fa commit.')
			return
		end

		local commitExit = execute(string.format(
			'git -C "%s" commit -m "Actualitza fotos del portfolio" -- "%s"',
			repoRoot, portfolioRel
		))
		if commitExit ~= 0 then
			appendLog(repoRoot, string.format('ERROR: git commit ha fallat (codi=%s)', tostring(commitExit)))
			LrDialogs.message('aGit@', "El 'git commit' ha fallat. Revisa scripts/lightroom-sync.log.", 'warning')
			return
		end

		local pushExit = execute(string.format('git -C "%s" push', repoRoot))
		if pushExit ~= 0 then
			appendLog(repoRoot, string.format('ERROR: git push ha fallat (codi=%s)', tostring(pushExit)))
			LrDialogs.message('aGit@', "El 'git push' ha fallat. Revisa scripts/lightroom-sync.log i puja manualment.", 'warning')
			return
		end

		appendLog(repoRoot, 'Commit i push fets correctament.')
	end)
end

return PortfolioSync
