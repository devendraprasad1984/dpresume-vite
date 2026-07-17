import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  ParagraphFeature,
  UnderlineFeature,
  BoldFeature,
  ItalicFeature,
} from '@payloadcms/richtext-lexical'
import { Field } from 'payload'

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
        ]
      },
    }),
  }
}
