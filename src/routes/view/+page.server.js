import { getImages } from '$lib/images.js';
import { error } from '@sveltejs/kit';

export function load() {
    const files = getImages();
    if (!files.length) error(404, 'No images found');
    return { files };
}
