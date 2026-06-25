import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Expert Electronic',

  projectId: 'q1vklck6',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Products')
              .icon(() => '📦')
              .child(
                S.documentList()
                  .title('All Products')
                  .filter('_type == "product"')
                  .defaultOrdering([{field: 'name', direction: 'asc'}])
              ),
            S.listItem()
              .title('Projects')
              .icon(() => '🏗️')
              .child(
                S.documentList()
                  .title('All Projects')
                  .filter('_type == "project"')
                  .defaultOrdering([{field: 'year', direction: 'desc'}])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
