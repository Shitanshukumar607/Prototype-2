const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'textures');

async function processImages() {
    try {
        const files = fs.readdirSync(dir);
        let totalOriginalSize = 0;
        let totalNewSize = 0;

        for (const file of files) {
            if (!file.match(/\.(png|jpg|jpeg)$/i)) continue;

            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            totalOriginalSize += stats.size;

            console.log(`Processing: ${file} (Original size: ${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

            const tempPath = path.join(dir, `temp_${file}`);

            const image = sharp(filePath).resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true });

            if (file.match(/\.png$/i)) {
                image.png({ quality: 70, compressionLevel: 9, effort: 10 });
            } else if (file.match(/\.(jpg|jpeg)$/i)) {
                image.jpeg({ quality: 70 });
            }

            await image.toFile(tempPath);

            // Replace original file with the compressed one
            fs.renameSync(tempPath, filePath);

            const newStats = fs.statSync(filePath);
            totalNewSize += newStats.size;
            console.log(` -> New size: ${(newStats.size / 1024 / 1024).toFixed(2)} MB`);
        }

        console.log(`\nCompression Complete!`);
        console.log(`Original Total Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`New Total Size: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);

    } catch (err) {
        console.error('Error processing images:', err);
    }
}

processImages();
