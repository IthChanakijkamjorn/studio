# Expert Electronic — Sanity Studio and product files

## Adding or changing products
Products are managed from the back office (Expert-Electronic-Stock), which also publishes them to the website.
This repo only holds the Excel files, photos and datasheets that the back office imports.

```
import/
  _TEMPLATE_products.xlsx      ← copy this; files starting with "_" are not imported
  BOSE_products.xlsx           ← one file per brand
  images/BOSE/BOSE AM40.png
  datasheets/BOSE/BOSE AM40.pdf
```

1. Edit or add `<BRAND>_products.xlsx` and drop the photos/PDFs into `images/<Brand>/` and `datasheets/<Brand>/`.
2. Commit and push.
3. Back office → Products → Import → Start import. Stock app and website are both updated.

### Excel format
Sheet **Products** (column order does not matter, only the header names):

| Column | Notes |
|---|---|
| Brand | Required. Same spelling as the image/datasheet folder. |
| Model | Required. Unique; used to match the product on re-import. |
| Name | Optional. Shown on both websites; if empty, Brand + Model is shown (e.g. BOSE AM40). |
| Main-Category, Sub-Category | Website menu, lowercase-with-dashes, e.g. `pa-speaker`, `ceiling-speaker`. |
| Description | |
| Image, Datasheet | File names inside `images/<Brand>/` and `datasheets/<Brand>/`. A new image file name replaces the photo. |
| Quantity | Stock on hand, used only when the product is created. Re-imports ignore it; change stock in the back office (รับ/จ่ายสินค้า). |
| Unit | Defaults to ชิ้น. |
| Website | TRUE or empty = show on website, FALSE = back office only. |

Sheet **At-a-glance**: `ProductName`, `Bullets` (one bullet per row).
Sheet **Specifications**: `ProductName`, `tabName`, `Label`, `Value` (one row per spec line).
`ProductName` is the product's Name, or its Model when Name is empty.
A product with no rows in these two sheets keeps the bullets/specs it already has.

**Export → edit → import:** the back office's ดาวน์โหลด Excel button (สินค้า and รายการสินค้าทั้งหมด pages) downloads
every product in this exact layout. Edit it, then on Products → Import click **อัปโหลดไฟล์ Excel** and pick the file (no push needed). Or save it here as `<NAME>_products.xlsx`, push and import. If you do that,
delete the old per-brand files for the same products so two files don't disagree. The layout is defined in the back
office's `src/lib/productSheet.ts`, and this template is generated from it.

`importProducts.js` is the old direct-to-Sanity importer. Do not use it any more: it bypasses the back office.

## Studio
`npm install && npm run dev` runs the Studio locally; it is deployed at https://expert-electronic.sanity.studio
(still used for website content such as projects).
