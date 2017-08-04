import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: "src/index.ts",
  external: [ "fw" ],
  dest: "dist/fw-dialog.js",
  plugins: [
    typescript(),
    babel(),
    commonjs(),
    resolve({
      browser: true,
      jsnext: true,
      main: true,
      preferBuiltins: false,
    })
  ]
}
