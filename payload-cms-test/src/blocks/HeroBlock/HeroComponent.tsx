import React from 'react'
import type { HeroBlock } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface Props {
  block: HeroBlock
}

const HeroComponent = ({ block }: Props) => {
  return (
    <div>
      <h3>INSIDE HERO</h3>
      <div style={{ color: 'red' }}>{block.title}</div>
      <RichText data={block['subheading-1']} />
      <img src={block.image.url} alt={block.image.alt} />
      <a href={block.cta_button?.url as string}>{block.cta_button?.label}</a>
      <hr />
    </div>
  )
}
export default HeroComponent
