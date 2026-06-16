export default {
  name: 'specSection',
  title: 'Spec Section',
  type: 'object',
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
      of: [{ type: 'specRow' }]
    }
  ],
  preview: {
    select: { title: 'sectionName' },
    prepare({ title }) {
      return { title: title || '(No section heading)' }
    }
  }
}
