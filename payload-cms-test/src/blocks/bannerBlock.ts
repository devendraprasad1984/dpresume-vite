import type { Block } from 'payload'
import { RTFField } from '@/blocks/RTFField'

export const BannerBlock: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    RTFField('content'),
  ],
  interfaceName: 'BannerBlock',
}
