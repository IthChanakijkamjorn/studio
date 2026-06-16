export default {
  name: 'specTab',
  title: 'Spec Tab',
  type: 'object',
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
      of: [{ type: 'specSection' }]
    }
  ],
  preview: {
    select: { title: 'tabName' }
  }
}
