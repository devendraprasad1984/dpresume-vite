import React from 'react'
import type {BannerBlock as BannerProps} from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

// type blockProps = Extract<Page["Layouts"][0], { blockType: "banner" }>
interface Props {
  block: BannerProps
}

export const BannerBlockComponent: React.FC<Props> = ({ block }) => {
  return (
    <div style={{
        border: '1px solid red',
            padding: '5px',
    }}>
      <RichText data={block.content} />
    </div>
  )
}
