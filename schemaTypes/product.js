export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      description: 'Auto-generated from name. Click Generate.',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'NATV & Distribution', value: 'natv' },
          { title: 'Sound Systems', value: 'sound' },
          { title: 'LED & Display', value: 'led' },
          { title: 'CCTV & Security', value: 'cctv' },
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    },
    {
      name: 'atAGlance',
      title: 'At a Glance',
      description: 'Key bullet points shown on the product page',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'specifications',
      title: 'Specifications',
      description: 'Tabbed specification sections (Technical, General, Packaging, etc.)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'specTab',
          title: 'Specification Tab',
          fields: [
            {
              name: 'tabName',
              title: 'Tab Name',
              type: 'string',
              description: 'e.g. Technical Data, General Data, Packaging Data',
              validation: Rule => Rule.required()
            },
            {
              name: 'sections',
              title: 'Sections',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'specSection',
                  title: 'Section',
                  fields: [
                    {
                      name: 'sectionName',
                      title: 'Section Name',
                      type: 'string',
                      description: 'e.g. HDMI Input, Video Encoding (leave blank if no section heading)',
                    },
                    {
                      name: 'rows',
                      title: 'Rows',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          name: 'specRow',
                          title: 'Spec Row',
                          fields: [
                            {
                              name: 'label',
                              title: 'Label',
                              type: 'string',
                              validation: Rule => Rule.required()
                            },
                            {
                              name: 'value',
                              title: 'Value',
                              type: 'string',
                              validation: Rule => Rule.required()
                            },
                          ],
                          preview: {
                            select: { title: 'label', subtitle: 'value' }
                          }
                        }
                      ]
                    }
                  ],
                  preview: {
                    select: { title: 'sectionName' },
                    prepare({ title }) {
                      return { title: title || '(No section heading)' }
                    }
                  }
                }
              ]
            }
          ],
          preview: {
            select: { title: 'tabName' }
          }
        }
      ]
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'datasheet',
      title: 'Datasheet (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' }
    },
    {
      name: 'featured',
      title: 'Featured Product?',
      type: 'boolean',
      initialValue: false,
    }
  ]
}
