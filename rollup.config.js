import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'build/tt.js',
    format: 'iife',
    name: 'TinyTag', // Changed to avoid overriding window.tt
    sourcemap: false
  },
  plugins: [
    terser({
      compress: {
        drop_console: true,
        pure_funcs: ['console.log']
      },
      mangle: true
    })
  ]
};