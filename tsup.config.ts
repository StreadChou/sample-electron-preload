import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: ['src/index.ts'], // 每个入口点都可以自定义
        outDir: 'dist',
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
    },
    {
        entry: ['src/main/index.ts'], // 每个入口点都可以自定义
        outDir: 'dist/main',
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
    },
    {
        entry: ['src/preload/index.ts'],
        outDir: 'dist/preload',
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
    },
    {
        entry: ['src/renderer/index.ts'],
        outDir: 'dist/renderer',
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
    }
]);