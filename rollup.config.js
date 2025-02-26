import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'build/tt.js',
    format: 'iife',
    name: 'TinyTag', // Changed to avoid overriding window.tt
    sourcemap: false
  },
  plugins: [
    json(),
    terser({
      compress: {
        drop_console: true,
        pure_funcs: ['console.log']
      },
      mangle: true
    })
  ]
};