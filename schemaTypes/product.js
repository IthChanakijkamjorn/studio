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
      name: 'shortDescription',
      title: 'Short Description',
      description: 'Shown on product cards (1-2 sentences)',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 5,
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