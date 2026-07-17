import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import xlsx from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── Sanity Client ─────────────────────────────────────────────────────────
const client = createClient({
  projectId: 'q1vklck6',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
})

// ─── Helpers ───────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

async function uploadImage(filename) {
  const filePath = path.join(__dirname, 'import', 'images', filename)
  if (!existsSync(filePath)) {
    console.warn(`  ⚠️  Image not found: ${filename}`)
    return null
  }
  console.log(`  🖼️  Uploading image: ${filename}`)
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename,
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function uploadDatasheet(filename) {
  const filePath = path.join(__dirname, 'import', 'datasheets', filename)
  if (!existsSync(filePath)) {
    console.warn(`  ⚠️  Datasheet not found: ${filename}`)
    return null
  }
  console.log(`  📄  Uploading datasheet: ${filename}`)
  const asset = await client.assets.upload('file', createReadStream(filePath), {
    filename,
  })
  return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
}

// ─── Read Excel ─────────────────────────────────────────────────────────────

function readExcel() {
  const filePath = path.join(__dirname, 'import', 'products.xlsx')
  const workbook = xlsx.readFile(filePath)

  // Sheet 1 - products
  const productsSheet = workbook.Sheets['Products']
  const products = xlsx.utils.sheet_to_json(productsSheet)

  // Sheet 2 - specifications
  const specsSheet = workbook.Sheets['Specifications']
  const specs = xlsx.utils.sheet_to_json(specsSheet)

  // Sheet 3 - atAGlance
  const glanceSheet = workbook.Sheets['At-a-glance']
  const glance = xlsx.utils.sheet_to_json(glanceSheet)

  return { products, specs, glance }
}

// ─── Build Specifications ───────────────────────────────────────────────────
//
// Excel columns: ProductName | tabName | Label | Value
// Output: array of specTab { tabName (optional), rows[] }

function buildSpecifications(productName, specs) {
  const productSpecs = specs.filter(
    row => String(row.ProductName).trim() === String(productName).trim()
  )

  if (!productSpecs.length) return []

  // Group by tabName → rows
  const tabMap = new Map()

  for (const row of productSpecs) {
    const tabName = String(row.tabName || '').trim()
    const label = String(row.Label || '').trim()
    const value = String(row.Value || '').trim()

    if (!label || !value) continue

    const tabKey = tabName || '__none__'

    if (!tabMap.has(tabKey)) tabMap.set(tabKey, [])
    tabMap.get(tabKey).push({
      _type: 'specRow',
      _key: slugify(`${label}-${Math.random().toString(36).slice(2, 7)}`),
      label,
      value,
    })
  }

  const specTabs = []
  for (const [tabKey, rows] of tabMap) {
    specTabs.push({
      _type: 'specTab',
      _key: slugify(`${tabKey}-${Math.random().toString(36).slice(2, 7)}`),
      tabName: tabKey === '__none__' ? '' : tabKey,
      rows,
    })
  }

  return specTabs
}

// ─── Build At a Glance ──────────────────────────────────────────────────────

function buildAtAGlance(productName, glance) {
  return glance
    .filter(row => String(row.ProductName).trim() === String(productName).trim())
    .map(row => String(row.Bullets || '').trim())
    .filter(Boolean)
}

// ─── Main Import ──────────────────────────────────��─────────────────────────

async function importProducts() {
  console.log('📦 Reading Excel file...')
  const { products, specs, glance } = readExcel()
  console.log(`✅ Found ${products.length} product(s)\n`)

  for (const row of products) {
    const name = String(row.Name || '').trim()
    if (!name) {
      console.warn('⚠️  Skipping row with no name')
      continue
    }

    console.log(`\n🚀 Importing: ${name}`)

    // Upload image
    const imageField = row.Image ? await uploadImage(String(row.Image).trim()) : null

    // Upload datasheet
    const datasheetField = row.Datasheet ? await uploadDatasheet(String(row.Datasheet).trim()) : null

    // Build nested fields
    const specifications = buildSpecifications(name, specs)
    const atAGlance = buildAtAGlance(name, glance)

    // Build Sanity document
    const doc = {
      _type: 'product',
      name,
      slug: { _type: 'slug', current: slugify(name) },
      mainCategory: String(row['Main-Category'] || '').trim().toLowerCase(),
      subCategory: String(row['Sub-Category'] || '').trim().toLowerCase(),
      brand: String(row.Brand || '').trim(),
      description: String(row.Description || '').trim(),
      featured: String(row.Feature || '').trim().toLowerCase() === 'true',
      atAGlance,
      specifications,
      ...(imageField && { image: imageField }),
      ...(datasheetField && { datasheet: datasheetField }),
    }

    // Create or replace document in Sanity
    const docId = `product-${slugify(name)}`
    await client.createOrReplace({ ...doc, _id: docId })
    console.log(`  ✅ Done: ${name}`)
  }

  console.log('\n🎉 Import complete!')
}

importProducts().catch(err => {
  console.error('❌ Import failed:', err)
  process.exit(1)
})
