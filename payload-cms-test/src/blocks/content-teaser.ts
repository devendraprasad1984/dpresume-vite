import type { Block } from 'payload'

export const ContentTeaser: Block = {
  slug: 'content-teaser',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'tab-1',
          fields: [
            {
              name: 'alt-2',
              type: 'text',
              required: false,
            },
            {
              name: 'message-2',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          label: 'tab-2',
          fields: [
            {
              name: 'alt-3',
              type: 'text',
              required: false,
            },
            {
              name: 'message-3',
              type: 'textarea',
              required: false,
            },
          ],
        },
      ],
    },
  ],
}
