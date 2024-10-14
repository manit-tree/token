import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: './dist',
        minify: false,
        sourcemap: false,
        emptyOutDir: true,
        lib: {
            entry: './src/index.js',
            name:'sha256',
            formats: ['es','cjs','iife'],
            fileName: (format) => `[name].[format].js`
        }
    }
})