import { Field } from 'payload'
import { globalBlocks } from '@/globalBlocks'

export const LayoutBlockField = (name = 'Layouts'): Field => {
  return {
    name,
    type: 'blocks',
    label: 'choose layout',
    blocks: globalBlocks().allBlocks,
    admin: {
      description: 'choose blocks',
      initCollapsed: true,
    },
    required: false,
  }
}
