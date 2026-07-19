import type { Block } from 'payload'

export const FormsBlock: Block = {
  slug: 'forms-block',
  fields: [
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
