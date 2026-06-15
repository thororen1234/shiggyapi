import { randomShiggy } from '$lib/images.js';

export function load() {
    return { favicon: randomShiggy() };
}
