import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { existsSync, readdirSync } from 'fs'
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

async function uploadImage(brand, filename) {
  const filePath = path.join(__dirname, 'import', 'images', brand, filename)
  if (!existsSync(filePath)) {
    console.warn(`  ⚠️  Image not found: images/${brand}/${filename}`)
    return null
  }
  console.log(`  🖼️  Uploading image: ${filename}`)
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function uploadDatasheet(brand, filename) {
  const filePath = path.join(__dirname, 'import', 'datasheets', brand, filename)
  if (!existsSync(filePath)) {
    console.warn(`  ⚠️  Datasheet not found: datasheets/${brand}/${filename}`)
    return null
  }
  console.log(`  📄  Uploading datasheet: ${filename}`)
  const asset = await client.assets.upload('file', createReadStream(filePath), { filename })
  return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
}

// ─── Read Excel ─────────────────────────────────────────────────────────────

function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath)

  const productsSheet = workbook.Sheets['Products']
  const products = productsSheet ? xlsx.utils.sheet_to_json(productsSheet) : []

  const specsSheet = workbook.Sheets['Specifications']
  const specs = specsSheet ? xlsx.utils.sheet_to_json(specsSheet) : []

  const glanceSheet = workbook.Sheets['At-a-glance']
  const glance = glanceSheet ? xlsx.utils.sheet_to_json(glanceSheet) : []

  return { products, specs, glance }
}

// ─── Build Specifications ───────────────────────────────────────────────────
//
// Excel columns: ProductName | tabName | Label | Value

function buildSpecifications(productName, specs) {
  const productSpecs = specs.filter(
    row => String(row.ProductName || '').trim() === String(productName).trim()
  )

  if (!productSpecs.length) return []

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
    .filter(row => String(row.ProductName || '').trim() === String(productName).trim())
    .map(row => String(row.Bullets || '').trim())
    .filter(Boolean)
}

// ─── Import from one Excel file ────────────────────────────────────────────

async function importFromFile(filePath) {
  const fileName = path.basename(filePath)
  console.log(`\n📂 Processing: ${fileName}`)

  const { products, specs, glance } = readExcel(filePath)

  const validProducts = products.filter(row => String(row.Name || '').trim())
  console.log(`✅ Found ${validProducts.length} product(s)`)

  for (const row of products) {
    const name = String(row.Name || '').trim()
    if (!name) continue

    const brand = String(row.Brand || '').trim()

    console.log(`\n🚀 Importing: ${name}`)

    const imageField = row.Image ? await uploadImage(brand, String(row.Image).trim()) : null
    const datasheetField = row.Datasheet ? await uploadDatasheet(brand, String(row.Datasheet).trim()) : null

    const specifications = buildSpecifications(name, specs)
    const atAGlance = buildAtAGlance(name, glance)

    const doc = {
      _type: 'product',
      name,
      slug: { _type: 'slug', current: slugify(name) },
      mainCategory: String(row['Main-Category'] || '').trim().toLowerCase(),
      subCategory: String(row['Sub-Category'] || '').trim().toLowerCase(),
      brand,
      description: String(row.Description || '').trim(),
      featured: String(row.Feature || '').trim().toLowerCase() === 'true',
      atAGlance,
      specifications,
      ...(imageField && { image: imageField }),
      ...(datasheetField && { datasheet: datasheetField }),
    }

    const docId = `product-${slugify(name)}`
    await client.createOrReplace({ ...doc, _id: docId })
    console.log(`  ✅ Done: ${name}`)
  }
}

// ─── Main Import ────────────────────────────────────────────────────────────

async function importProducts() {
  const importDir = path.join(__dirname, 'import')

  // Find all *_products.xlsx files
  let files = []
  try {
    files = readdirSync(importDir).filter(f => f.endsWith('_products.xlsx'))
  } catch {
    console.error(`❌ Could not read import directory: ${importDir}`)
    process.exit(1)
  }

  if (files.length === 0) {
    console.warn('⚠️  No *_products.xlsx files found in the import/ folder.')
    console.warn('    Expected format: ITC_products.xlsx, WISI_products.xlsx, etc.')
    process.exit(0)
  }

  console.log(`📦 Found ${files.length} brand file(s): ${files.join(', ')}`)

  for (const file of files) {
    try {
      await importFromFile(path.join(importDir, file))
    } catch (err) {
      console.error(`❌ Failed to import ${file}:`, err.message)
      console.warn(`⏭️  Skipping ${file} and continuing...\n`)
    }
  }

  console.log('\n🎉 All imports complete!')
}

importProducts().catch(err => {
  console.error('❌ Import failed:', err)
  process.exit(1)
})
