import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { POSTS_DIR, CHECKED_FILE } from './images.js';

let checked = [];
if (fs.existsSync(CHECKED_FILE)) {
    try {
        checked = JSON.parse(fs.readFileSync(CHECKED_FILE, 'utf-8'));
    } catch {
        checked = [];
    }
}

async function processImage(fileUrl, outputPath) {
    if (checked.includes(fileUrl)) return;
    try {
        const arrayBuffer = await fetch(fileUrl).then(r => r.arrayBuffer());
        const buffer = Buffer.from(arrayBuffer);
        const image = sharp(buffer);
        const metadata = await image.metadata();
        const aspectRatio = metadata.width / metadata.height;
        if (aspectRatio < 0.96 || aspectRatio > 1.04) return;
        await image.png().toFile(outputPath);
    } catch (e) { } finally {
        checked.push(fileUrl);
        fs.writeFileSync(CHECKED_FILE, JSON.stringify(checked, null, 2));
    }
}

export async function scrapeImages() {
    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR);

    let page = 1;
    while (true) {
        let json;
        try {
            json = await fetch(
                `https://danbooru.donmai.us/posts.json?tags=kemomimi-chan_(naga_u)&page=${page}`
            ).then(r => r.json());
        } catch (e) {
            console.error('Failed to fetch page', page, e.message);
            break;
        }

        if (!json.length) break;

        for (const post of json) {
            const fileUrl = post.file_url;
            if (!fileUrl || (post.rating !== 'g' && post.rating !== 's')) continue;
            if (!fileUrl.match(/\.(png|jpg|jpeg|webp|gif)$/i)) continue;

            const filename = `${post.id}.png`;
            const filepath = path.join(POSTS_DIR, filename);
            if (fs.existsSync(filepath)) continue;

            await processImage(fileUrl, filepath);
        }

        page++;
    }
}
