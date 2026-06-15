import fs from 'fs';
import path from 'path';
import { POSTS_DIR } from '$lib/images.js';
import { error } from '@sveltejs/kit';

export function GET({ params }) {
    const { filename } = params;

    if (filename.includes('/') || filename.includes('..') || !filename.endsWith('.png')) {
        error(400, 'Bad request');
    }

    const filepath = path.join(POSTS_DIR, filename);
    if (!fs.existsSync(filepath)) error(404, 'Not found');

    const file = fs.readFileSync(filepath);
    return new Response(file, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, immutable'
        }
    });
}
