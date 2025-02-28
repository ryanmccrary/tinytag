import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve'; // Resolve node_modules
import commonjs from '@rollup/plugin-commonjs'; // Handle UMD/CommonJS

export default [
  {
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
            pure_funcs: ['console.log'],
            dead_code: true,
            drop_debugger: true,
            conditionals: true,
            unused: true,
            toplevel: true,
            passes: 3
          },
          mangle: { toplevel: true },
          output: { comments: false }
      })
    ]
  },
  {
    input: 'src/rudder-compat.js',
    output: {
      file: 'build/tt-rudder-compat.js',
      format: 'iife',
      name: 'TinyTagRudderCompat',
      sourcemap: false
    },
    plugins: [
      nodeResolve({
        browser: true // Resolve for browser environment
      }),
      commonjs(),
      terser({
        compress: { drop_console: true, pure_funcs: ['console.log'], passes: 3 },
        mangle: { toplevel: true },
        output: { comments: false }
      })
    ]
  }
];