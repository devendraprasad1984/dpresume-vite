import type { Block } from 'payload'
import { RTFField } from '@/blocks/RTFField'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  imageURL: '/assets/hero_thumbnail.jpg',
  fields: [
    {
      name: 'variation',
      type: 'select',
      label: 'Hero Variation',
      options: [
        {
          label: 'hero_banner_1',
          value: 'hero_banner_1',
        },
        {
          label: 'hero_banner_2',
          value: 'hero_banner_2',
        },
        {
          label: 'hero_banner_3',
          value: 'hero_banner_3',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    RTFField('subheading-1'),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cta_button',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}
