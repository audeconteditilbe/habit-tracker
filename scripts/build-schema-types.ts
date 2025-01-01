import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import { parse as yamlParse } from 'yaml'

import type { OpenAPI3 } from 'openapi-typescript'
import openapiTS, { astToString } from 'openapi-typescript'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..', 'apis')

const commentHeader = `/**
 * This file was auto-generated.
 * Do not make direct changes to the file.
 * Instead, run "yarn build:api-types" to re-generate it.
 */

`
const main = async () => {
  const inputPath = path.resolve(root, 'schemas', 'core.openapi.yml')
  const outputPath = path.resolve(root, 'types', 'core.d.ts')

  const schema = await fs
    .readFile(inputPath, 'utf8')
    .then((buf) => yamlParse(buf) as OpenAPI3)
  const ast = await openapiTS(schema)
  const types = astToString(ast)
  await fs.writeFile(outputPath, `${commentHeader}${types}`)
}

main()
  .then(() => console.log('✔️ Types built successfully'))
  .catch(console.error)
