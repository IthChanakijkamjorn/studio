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

| Column | Used by | Notes |
|---|---|---|
| Brand | both | Required. Same spelling as the image/datasheet folder. |
| Model | both | Recommended. Unique; used to match the product on re-import. If empty, guessed from the image file name. |
| Name | both | Required. Also the key for the other two sheets. |
| Main-Category, Sub-Category | website | lowercase-with-dashes, e.g. `pa-speaker`, `ceiling-speaker`. |
| Description | both | |
| Image, Datasheet | both | File names inside `images/<Brand>/` and `datasheets/<Brand>/`. A new image file name replaces the photo. |
| Website | website | TRUE or empty = show on website, FALSE = back office only. |
| Featured | website | TRUE = featured product. |
| Unit, Supplier, Min-Stock | back office | Optional. Unit defaults to ชิ้น. |
| Opening-Stock | back office | Optional. Only used the first time the product is created; after that use stock movements. |

Sheet **At-a-glance**: `ProductName`, `Bullets` (one bullet per row).
Sheet **Specifications**: `ProductName`, `tabName`, `Label`, `Value` (one row per spec line).

`importProducts.js` is the old direct-to-Sanity importer. Do not use it any more: it bypasses the back office.

## Studio
`npm install && npm run dev` runs the Studio locally; it is deployed at https://expert-electronic.sanity.studio
(still used for website content such as projects).
