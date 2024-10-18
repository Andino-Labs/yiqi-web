import { defineConfig } from 'tsup'

const tsupConfig = defineConfig({
  entry: ['yiqi-client/src/index.ts'],
  outDir: 'yiqi-client/dist',
  format: ['esm'],
  clean: true,
  dts: true,
  tsconfig: 'tsconfig.client.json'
})

// eslint-disable-next-line
export default tsupConfig
