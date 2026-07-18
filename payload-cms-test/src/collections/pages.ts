import type { CollectionConfig } from 'payload'
import { groups } from '@/globalEnum'
import { RTFField } from '@/blocks/RTFField'
import { globalBlocks } from '@/globalBlocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    group: groups.pages,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      maxLength: 20,
      admin: {
        description: 'page identifier',
      },
    },
    {
      name: 'name',
      type: 'text',
      maxLength: 20,
      admin: {
        description: (p) => `20 chars left`,
      },
    },
    {
      name: 'message',
      type: 'textarea',
      admin: {
        description: (p) => `enter contents here`,
      },
    },
    RTFField('page-main-content'),
    {
      name: 'Layouts',
      type: 'blocks',
      label: 'choose Layout',
      blocks: globalBlocks().allBlocks,
      admin: {
        description: 'this is global blocks fields',
        initCollapsed: true,
      },
      required: true,
    },
  ],
}
