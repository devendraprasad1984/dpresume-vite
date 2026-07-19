import React from 'react'
import type { BannerBlock as BannerProps } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface Props {
  block: BannerProps
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
