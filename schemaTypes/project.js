export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(2000).max(2100),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
            },
          ],
        },
      ],
      options: { layout: 'grid' },
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      location: 'location',
      media: 'images.0',
    },
    prepare({ title, year, location, media }) {
      return {
        title,
        subtitle: [year, location].filter(Boolean).join(' · '),
        media,
      };
    },
  },
};
