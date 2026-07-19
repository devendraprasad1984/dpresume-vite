import type { Block } from 'payload'

export const FormsBlock: Block = {
  slug: 'forms-block',
  fields: [
    { name: 'id', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: false,
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: ['forms'],
      required: false,
    },
  ],
}
