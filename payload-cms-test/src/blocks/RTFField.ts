import type { TextFieldSingleValidation } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  ParagraphFeature,
  UnderlineFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import { Field } from 'payload'
import {globalObjects} from "@/globalObjects";

export const RTFField = (name = 'content'): Field => {
  return {
    name,
    label: 'Contents',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          ParagraphFeature(),
          UnderlineFeature(),
          BoldFeature(),
          ItalicFeature(),
          LinkFeature({
            enabledCollections: globalObjects().collectionSlugs,
            fields: ({ defaultFields }) => {
              const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
                if ('name' in field && field.name === 'url') return false
                return true
              })

              return [
                ...defaultFieldsWithoutUrl,
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
                  },
                  label: ({ t }) => t('fields:enterURL'),
                  required: true,
                  validate: ((value, options) => {
                    if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                      return true // no validation needed, as no url should exist for internal links
                    }
                    return value ? true : 'URL is required'
                  }) as TextFieldSingleValidation,
                },
              ]
            },
          }),
        ]
      },
    }),
  }
}
