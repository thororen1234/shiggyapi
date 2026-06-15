import { randomShiggy } from '$lib/images.js';
import { error, json } from '@sveltejs/kit';

export function GET() {
    const filename = randomShiggy();
    if (!filename) error(404, 'No images found');
    return json({ filename });
}
