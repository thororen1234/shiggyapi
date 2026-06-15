import { getImages } from '$lib/images.js';
import { json } from '@sveltejs/kit';

export function GET() {
    return json(getImages());
}
