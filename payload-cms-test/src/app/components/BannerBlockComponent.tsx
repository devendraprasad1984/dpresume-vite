import React from 'react'
import type { BannerBlock as BannerProps } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'

// type blockProps = Extract<Page["Layouts"][0], { blockType: "banner" }>
interface Props {
  block: BannerProps
}

//const content: Post['richText'] = data;
export const BannerBlockComponent: React.FC<Props> = ({ block }) => {
  const content = block.content as SerializedEditorState<SerializedLexicalNode>
  return (
    <div
      style={{
        border: '1px solid red',
        padding: '5px',
      }}
    >
      <RichText data={content} />
    </div>
  )
}
