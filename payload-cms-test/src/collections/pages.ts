import type { CollectionConfig } from 'payload'
import { groups } from '@/globalEnum'
import {
  BlocksFeature,
  lexicalEditor,
  LinkFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

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
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures, rootFeatures }) => [
          ...defaultFeatures,
          LinkFeature({
            // Example showing how to customize the built-in fields
            // of the Link feature
            fields: ({ defaultFields }) => [
              ...defaultFields,
              {
                name: 'rel',
                label: 'Rel Attribute',
                type: 'select',
                hasMany: true,
                options: ['noopener', 'noreferrer', 'nofollow'],
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
              },
            ],
          }),
          UploadFeature({
            collections: {
              uploads: {
                // Example showing how to customize the built-in fields
                // of the Upload feature
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                    editor: lexicalEditor(),
                  },
                ],
              },
            },
          }),
          // This is incredibly powerful. You can reuse your Payload blocks
          // directly in the Lexical editor as follows:
          BlocksFeature({}),
        ],
        admin: {
          placeholder: 'Type your content here...',
          hideGutter: true,
        },
      }),
    },
  ],
}
