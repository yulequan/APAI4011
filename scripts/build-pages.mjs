import { copyFile } from 'node:fs/promises';
import { build } from 'vite';

await build({ configFile: 'vite.pages.config.ts' });
await copyFile('dist/pages/index.html', 'dist/pages/404.html');
