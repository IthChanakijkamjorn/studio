export default {
  name: 'specTab',
  title: 'Spec Tab',
  type: 'object',
  fields: [
    {
      name: 'tabName',
      title: 'Tab Name',
      type: 'string',
      description: 'e.g. Technical Data, General Data, Packaging Data (optional)',
    },
    {
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [{ type: 'specRow' }]
    }
  ],
  preview: {
    select: { title: 'tabName' },
    prepare({ title }) {
      return { title: title || '(No tab name)' }
    }
  }
}
