import express from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { config } from "dotenv";

const env = config({ processEnv: {} }).parsed;

const PORT = env.PORT || 4000;
const SITE = env.SITE || `http://localhost:${PORT}`;
const POSTS_DIR = path.resolve("./posts");
const CHECKED_FILE = path.resolve("./checked.json");

const app = express();
app.use("/image", express.static(POSTS_DIR));
app.use(express.static(path.resolve("./public")));

let checked = [];
if (fs.existsSync(CHECKED_FILE)) {
    try {
        checked = JSON.parse(fs.readFileSync(CHECKED_FILE, "utf-8"));
    } catch {
        checked = [];
    }
}

function randomShiggy() {
    const files = fs.existsSync(POSTS_DIR)
        ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".png"))
        : [];
    return files[Math.floor(Math.random() * files.length)];
}

function getFragment(filename) {
    return `
        <div class="shiggy">
            <img src="/image/${filename}" />
            <a href="/image/${filename}">Permalink</a>
            <a href="#" onclick="window.location.reload()">Another one</a>
        </div>
    `;
}

function renderMeta(imagesNum, randomFavicon) {
    return `
        <meta property="og:title" content="The Shiggy API" />
        <meta property="og:description" content="${imagesNum} random images of Shiggy and counting..." />
        <meta property="og:image" content="${SITE}/${randomFavicon}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${SITE}/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Shiggy API" />
        <meta name="twitter:description" content="${imagesNum} random images of Shiggy and counting..." />
        <meta name="twitter:image" content="${SITE}/${randomFavicon}" />
    `
}

function renderPage(title, bodyContent) {
    if (!fs.existsSync(POSTS_DIR)) return res.status(404).send("404 Not Found");
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".png"));
    const imagesNum = files.length;
    const randomFavicon = "image/" + files[Math.floor(Math.random() * imagesNum)];

    return `
        <head>
            <title>${title}</title>
            <link rel="stylesheet" href="/style.css">
            <link rel="icon" href="/${randomFavicon}" type="image/png">
            ${renderMeta(imagesNum, randomFavicon)}
        </head>
        <body>
            ${bodyContent}
        </body>
    `;
}

app.get("/", (req, res) => {
    if (!fs.existsSync(POSTS_DIR)) return res.status(404).send("404 Not Found");
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".png"));
    if (!files.length) return res.status(404).send("404 Not Found");

    res.send(renderPage(
        "Shiggy",
        `<div class="center">
            ${getFragment(randomShiggy())}
        </div>`
    ));
});

app.get("/image/random", (req, res) => {
    res.redirect("/image/" + randomShiggy());
});

app.get("/view", (req, res) => {
    if (!fs.existsSync(POSTS_DIR)) return res.status(404).send("404 Not Found");
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".png"));
    if (!files.length) return res.status(404).send("404 Not Found");

    const thumbnails = files.map(f => `
        <div class="thumbnail">
            <a href="/image/${f}">
                <img src="/image/${f}" width="128" height="128" />
            </a>
        </div>
    `).join("\n");

    res.send(renderPage(
        "All Shiggy Images",
        `<h1>All Shiggy Images (${files.length})</h1>
        <div class="center">${thumbnails}</div>`
    ));
});

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
    } catch (e) {
        console.warn(`Skipping ${fileUrl}: ${e.message}`);
    } finally {
        checked.push(fileUrl);
        fs.writeFileSync(CHECKED_FILE, JSON.stringify(checked, null, 2));
    }
}

async function scrapeImages() {
    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR);

    let page = 1;
    while (true) {
        let json;
        try {
            json = await fetch(`https://danbooru.donmai.us/posts.json?tags=kemomimi-chan_(naga_u)&page=${page}`).then(r => r.json());
        } catch (e) {
            console.error("Failed to fetch page", page, e.message);
            break;
        }

        if (!json.length) break;

        for (const post of json) {
            const fileUrl = post.file_url;
            if (!fileUrl || (post.rating !== "g" && post.rating !== "s")) continue;
            if (!fileUrl.match(/\.(png|jpg|jpeg|webp|gif)$/i)) continue;

            const filename = `${post.id}.png`;
            const filepath = path.join(POSTS_DIR, filename);
            if (fs.existsSync(filepath)) continue;

            await processImage(fileUrl, filepath);
        }

        page++;
    }
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    scrapeImages();
});
