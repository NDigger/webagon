import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    root: './src',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'levelsContent', // путь к исходной папке с JSON
          dest: './'            // куда копировать в сборке
        }
      ]
    })
  ]
})