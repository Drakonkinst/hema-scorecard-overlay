// Following https://eisenbergeffect.medium.com/an-esbuild-setup-for-typescript-3b24852479fe

import esbuildPluginTsc from 'esbuild-plugin-tsc';

export const OUT_DIR = "public";

export function createBuildSettings(options) {
    return {
        entryPoints: ['src/main.ts'],
        outfile: OUT_DIR + '/bundle.js',
        bundle: true,
        plugins: [
            esbuildPluginTsc({
                force: true
            }),
        ],
        ...options
    };
}