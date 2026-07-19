import type { Block } from 'payload'

export const NewsLetterBlock: Block = {
  slug: 'news-letter',
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
