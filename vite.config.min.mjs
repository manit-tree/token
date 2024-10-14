import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: './dist',
        minify: true,
        sourcemap: true,
        emptyOutDir: false,
        lib: {
            entry: './src/index.ts',
            name:'$',
            formats: ['cjs','es'],
            fileName: (format) => `[name].[format].min.js`
        }
    }
})