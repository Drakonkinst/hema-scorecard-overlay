/**
 * Sources:
 * https://eisenbergeffect.medium.com/an-esbuild-setup-for-typescript-3b24852479fe
 * https://how-to.dev/how-to-build-a-multipage-website-with-esbuild
 */

import esbuildPluginTsc from 'esbuild-plugin-tsc';

export const OUT_DIR = "public";

export function createBuildSettings(options) {
    return {
        entryPoints: [
            'src/app.ts',
            'src/overlay/app.ts',
            'src/controller/app.ts'],
        outdir: OUT_DIR,
        splitting: true,
        bundle: true,
        format: "esm",
        plugins: [
            esbuildPluginTsc({
                force: true
            }),
        ],
        ...options
    };
}