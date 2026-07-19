import React from 'react'
import type {BannerBlock as BannerProps, Page} from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type blockProps = Extract<Page["Layouts"][0], { blockType: "banner" }>
interface Props {
  block: blockProps | BannerProps
}

export const BannerBlock: React.FC<Props> = ({ block }) => {
  return (
    <div style={{
        border: '1px solid red',
            padding: '5px',
    }}>
      <div>Banner Type: {block.style}</div>
      <RichText data={block.content} />
    </div>
  )
}
