import fs from 'fs';
import path from 'path';

export const POSTS_DIR = path.resolve('posts');
export const CHECKED_FILE = path.resolve('checked.json');

export function getImages() {
    if (!fs.existsSync(POSTS_DIR)) return [];
    return fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.png'));
}

export function randomShiggy() {
    const files = getImages();
    if (!files.length) return null;
    return files[Math.floor(Math.random() * files.length)];
}
