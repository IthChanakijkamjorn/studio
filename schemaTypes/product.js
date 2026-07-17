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
      name: 'mainCategory',
      title: 'Main Category',
      type: 'string',
      options: {
        list: [
          { title: 'PA Amplifier', value: 'pa-amplifier' },
          { title: 'PA Speaker', value: 'pa-speaker' },
          { title: 'Analog PA System', value: 'analog-pa-system' },
          { title: 'IP/PA Intercom', value: 'ip-pa-intercom' },
          { title: 'Audio Conference', value: 'audio-conference' },
          { title: 'Interactive Flat Panel', value: 'interactive-flat-panel' },
          { title: 'LED Stage Lighting', value: 'led-stage-lighting' },
          { title: 'Architecture Lighting', value: 'architecture-lighting' },
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'subCategory',
      title: 'Sub Category',
      type: 'string',
      options: {
        list: [
          // PA Amplifier
          { title: 'Mixer Amplifier', value: 'mixer-amplifier' },
          { title: 'Zone Mixer Amplifier', value: 'zone-mixer-amplifier' },
          { title: 'Class-D Power Amplifier', value: 'class-d-power-amplifier' },
          { title: 'Pre-Amplifier', value: 'pre-amplifier' },
          // PA Speaker
          { title: 'Ceiling Speaker', value: 'ceiling-speaker' },
          { title: 'Wall Mounted Speaker', value: 'wall-mounted-speaker' },
          { title: 'Active Speaker', value: 'active-speaker' },
          { title: 'Horn Speaker', value: 'horn-speaker' },
          { title: 'Projection Speaker', value: 'projection-speaker' },
          { title: 'Pendant Speaker', value: 'pendant-speaker' },
          { title: 'Garden Speaker', value: 'garden-speaker' },
          { title: 'Column Speaker', value: 'column-speaker' },
          // Analog PA System
          { title: 'Controller', value: 'controller' },
          { title: 'Audio Sources', value: 'audio-sources' },
          { title: 'Microphone', value: 'microphone' },
          { title: 'Volume Controller', value: 'volume-controller' },
          { title: 'Lectern', value: 'lectern' },
          { title: 'Others', value: 'others' },
          // IP/PA Intercom
          { title: '88 Series', value: '88-series' },
          { title: '77 Series', value: '77-series' },
          { title: '69 Series', value: '69-series' },
          // Audio Conference
          { title: 'Digital Conference', value: 'digital-conference' },
          // Interactive Flat Panel
          { title: 'itcHUB', value: 'itchub' },
          { title: '810 Series', value: '810-series' },
          { title: '820 Series', value: '820-series' },
          { title: '830E Series', value: '830e-series' },
          // LED Stage Lighting
          { title: 'Par Light', value: 'par-light' },
          { title: 'Effect Light', value: 'effect-light' },
          { title: 'Moving Head Light', value: 'moving-head-light' },
          { title: 'Console', value: 'console' },
          // Architecture Lighting
          { title: 'Flood Light', value: 'flood-light' },
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
      of: [{ type: 'specTab' }]
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
