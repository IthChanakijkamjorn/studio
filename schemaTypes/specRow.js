export default {
  name: 'specRow',
  title: 'Spec Row',
  type: 'object',
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
