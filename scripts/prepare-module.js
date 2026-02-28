const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Obtener argumentos: node prepare-module.js <modulo> <version>
const [, , moduleName, version] = process.argv;

if (!moduleName || !version) {
    console.error('❌ Uso: npm run prepare <modulo> <version>');
    process.exit(1);
}

const modulePath = path.join(__dirname, '../modules', moduleName, `v${version}`);
const manifestPath = path.join(modulePath, 'manifest.json');
const outputPath = path.join(modulePath, 'source.zip');

async function prepare() {
    if (!fs.existsSync(manifestPath)) {
        console.error(`❌ No se encontró el manifest en: ${manifestPath}`);
        process.exit(1);
    }

    // 1. Leer el manifiesto para saber qué incluir
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Lista de archivos: entry + files
    const filesToInclude = [manifest.entry, ...(manifest.files || [])];

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
    for (const fileRelativePath of filesToInclude) {
        const fullPath = path.join(modulePath, fileRelativePath);

        if (fs.existsSync(fullPath)) {
            // fileRelativePath se usa como nombre dentro del zip para mantener estructura
            archive.file(fullPath, { name: fileRelativePath });
            console.log(`   + ${fileRelativePath}`);
        } else {
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
