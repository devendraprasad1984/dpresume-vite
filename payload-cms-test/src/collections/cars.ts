import type { CollectionConfig } from 'payload'

export const Cars: CollectionConfig = {
  slug: 'cars',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'built',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: false,
    },
  ],
  upload: true,
}
