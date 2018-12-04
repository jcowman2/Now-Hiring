import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";

const tsPlugin = typescript({
    tsconfigOverride: {
        compilerOptions: { module: "ES2015" }
    }
});

const supressCircularImportWarnings = (message, defaultFunc) => {
    if (message.code === "CIRCULAR_DEPENDENCY") {
        return;
    }
    defaultFunc(message);
}

export default [
    {
        input: "./src/index.ts",
        output: { file: "./www/js/now-hiring.js", format: "iife", name: "NowHiring", extend: true },
        plugins: [
            tsPlugin,
            resolve(),
        ],
        onwarn: supressCircularImportWarnings
    }
]