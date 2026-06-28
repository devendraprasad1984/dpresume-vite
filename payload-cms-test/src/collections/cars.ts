import type { CollectionConfig } from 'payload'
import { groups } from '@/globalEnum'
import { ContentTeaser } from '@/blocks/content-teaser'
import {ContentTeaserV2} from "@/blocks/content-teaser-v2";

export const Cars: CollectionConfig = {
  slug: 'cars',
  access: {
    read: () => true,
  },
  admin: {
    group: groups.vehicle,
    components: {
      Description: './app/components/MyDescComponent#MyDescComponent',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 20,
      admin: {
        description: (p) => `chars left`,
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'built',
      type: 'text',
      required: true,
      admin: {
        description: 'this is card build type, including chasis here',
      },
    },
    {
      name: 'Year',
      type: 'date',
      admin: {
        description: 'this is model year',
        width: '50%',
        date: {
          pickerAppearance: 'monthOnly',
        },
      },
      required: false,
    },
    {
      name: 'Teasers',
      type: 'blocks',
      label: 'Content Teasers',
      blocks: [ContentTeaser, ContentTeaserV2],
      admin: {
        description: 'this is teaser',
        initCollapsed: true,
      },
      required: true,
    },
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
  upload: true,
}
