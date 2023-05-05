import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        open: 'index.html',
    },
    build: {
        assetsInlineLimit: 0,
    },
});