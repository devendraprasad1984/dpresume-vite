import React from 'react'
import type { HeroBlock } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  block: HeroBlock
}

const HeroComponent = ({ block }: Props) => {
  return (
    <div
      style={{
        border: '1px solid black',
        padding: '5px',
      }}
    >
      <h3>INSIDE HERO</h3>
      <h2 style={{ color: 'red' }}>{block.title}</h2>
      <RichText data={block['subheading-1']} />
      {typeof block.image === 'object' && block.image?.url && (
        <Image src={block.image?.url} alt={block.image?.alt} fill sizes="100vw" />
      )}
      <Link href={block.cta_button?.url as string}>{block.cta_button?.label}</Link>
    </div>
  )
}
export default HeroComponent
