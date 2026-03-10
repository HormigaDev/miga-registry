const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { glob: globAsync } = require('glob');

// Obtener argumentos: node prepare-module.js <modulo> <version>
const [, , moduleName, version] = process.argv;

if (!moduleName || !version) {
    console.error('❌ Uso: npm run pre <modulo> <version>');
    process.exit(1);
}

const modulePath = path.join(__dirname, '../modules', moduleName, `v${version}`);
const manifestPath = path.join(modulePath, 'manifest.json');
const outputPath = path.join(modulePath, 'source.zip');

async function expandPatterns(basePath, patterns) {
    const expandedFiles = new Set();

    for (const pattern of patterns) {
        // Detectar si es un patrón glob (contiene *, **, o ?)
        if (pattern.includes('*') || pattern.includes('?')) {
            try {
                const matches = await globAsync(pattern, { cwd: basePath, nodir: true });
                matches.forEach((match) => expandedFiles.add(match));
                console.log(`   📂 Patrón expandido: ${pattern} (${matches.length} archivos)`);
            } catch (err) {
                console.warn(`   ⚠️  Error procesando patrón: ${pattern}`);
            }
        } else {
            // Es un archivo específico
            expandedFiles.add(pattern);
        }
    }

    return Array.from(expandedFiles);
}

async function prepare() {
    if (!fs.existsSync(manifestPath)) {
        console.error(`❌ No se encontró el manifest en: ${manifestPath}`);
        process.exit(1);
    }

    // 1. Leer el manifiesto para saber qué incluir
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Lista de archivos: entry + files
    const filesToInclude = [manifest.entry, ...(manifest.files || [])];

    // 1.5. Expandir patrones glob
    const expandedFiles = await expandPatterns(modulePath, filesToInclude);

    console.log(`📦 Preparando ZIP para ${moduleName} v${version}...`);

    // 2. Configurar el archivo de salida
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        console.log(`✅ source.zip creado (${archive.pointer()} bytes)`);
        updateManifest(manifest);
    });

    archive.on('error', (err) => {
        throw err;
    });
    archive.pipe(output);

    // 3. Añadir solo los archivos declarados
    for (const fileRelativePath of expandedFiles) {
        const fullPath = path.join(modulePath, fileRelativePath);

        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
            // fileRelativePath se usa como nombre dentro del zip para mantener estructura
            archive.file(fullPath, { name: fileRelativePath });
            console.log(`   + ${fileRelativePath}`);
        } else if (!fs.existsSync(fullPath)) {
            console.warn(
                `   ⚠️  ADVERTENCIA: Archivo declarado no encontrado: ${fileRelativePath}`,
            );
        }
    }

    await archive.finalize();
}

function updateManifest(manifest) {
    // Inyectar el campo archive
    manifest.archive = 'source.zip';

    // Guardar el manifiesto actualizado
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`📝 manifest.json actualizado.`);
}

prepare().catch(console.error);
