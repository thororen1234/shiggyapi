import { getImages, randomShiggy } from '$lib/images.js';
import { error } from '@sveltejs/kit';

export function load({ url }) {
    const filename = randomShiggy();
    if (!filename) error(404, 'No images found');

    const total = getImages().length;
    const origin = url.origin;

    return { filename, total, origin };
}
