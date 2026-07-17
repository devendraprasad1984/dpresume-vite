import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import { RTFField } from '@/blocks/RTFField'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    RTFField('rtf_1'),
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
