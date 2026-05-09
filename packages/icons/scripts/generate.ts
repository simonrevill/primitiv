import { optimize } from 'svgo'
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs'
import { join, basename } from 'path'

const SVG_DIR = join(import.meta.dirname, '../icons/svg')
const OUT_DIR = join(import.meta.dirname, '../src/icons')

mkdirSync(OUT_DIR, { recursive: true })

function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

function extractInnerSvg(svgString: string): string {
  const match = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)
  if (!match) throw new Error('No <svg> element found')
  return match[1].trim()
}

// Convert SVG attribute names to JSX-compatible camelCase equivalents
function svgAttrsToJsx(inner: string): string {
  return inner
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/stroke-dasharray=/g, 'strokeDasharray=')
    .replace(/class=/g, 'className=')
}

const svgFiles = readdirSync(SVG_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort()

const componentNames: string[] = []

for (const file of svgFiles) {
  const svgContent = readFileSync(join(SVG_DIR, file), 'utf-8')
  const componentName = toPascalCase(basename(file, '.svg'))

  const { data: optimized } = optimize(svgContent, {
    plugins: [
      {
        name: 'preset-default',
        params: { overrides: { removeViewBox: false } },
      },
    ],
  })

  const innerSvg = svgAttrsToJsx(extractInnerSvg(optimized))

  const component = `import type { IconProps } from '../types'
import { IconBase } from '../IconBase'

export const ${componentName} = (props: IconProps) => (
  <IconBase {...props}>
    ${innerSvg}
  </IconBase>
)
`

  writeFileSync(join(OUT_DIR, `${componentName}.tsx`), component)
  componentNames.push(componentName)
  console.log(`✓ ${componentName}`)
}

const barrel = componentNames
  .map((name) => `export { ${name} } from './${name}.tsx'`)
  .join('\n')

writeFileSync(join(OUT_DIR, 'index.ts'), barrel + '\n')
console.log(`\n→ wrote ${componentNames.length} icons to src/icons/`)
