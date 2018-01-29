import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
export default [
  {
    entry: 'src/main.js',
    dest: pkg.browser,
    format: 'umd',
    moduleName: 'mehdux',
    external: ['react', 'preact'],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      }),
      resolve({
        // pass custom options to the resolve plugin
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      commonjs({
        extensions: ['.js', '.json'],
        namedExports: {
          react: ['Component', 'createElement'],
          preact: ['h', 'Component']
        }
      }),
      uglify()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    entry: 'src/main.js',
    targets: [
      { dest: pkg.main, format: 'cjs' },
      { dest: pkg.module, format: 'es' }
    ],
    external: ['preact', 'react'],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      }),
      resolve({
        // pass custom options to the resolve plugin
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      commonjs({
        extensions: ['.js', '.json'],
        namedExports: {
          react: ['Component', 'createElement'],
          preact: ['h', 'Component']
        }
      }),
      uglify()
    ]
  }
]
