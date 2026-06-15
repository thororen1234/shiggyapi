import { randomShiggy } from '$lib/images.js';
import { error, redirect } from '@sveltejs/kit';

export function GET() {
    const filename = randomShiggy();
    if (!filename) error(404, 'No images found');
    redirect(302, `/image/${filename}`);
}
