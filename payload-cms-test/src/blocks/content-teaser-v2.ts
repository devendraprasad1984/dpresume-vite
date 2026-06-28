import type { Block } from 'payload'

export const ContentTeaserV2: Block = {
  slug: 'content-teaser-V2',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'content',
      type: 'textarea',
      required: false,
    },
  ],
}
