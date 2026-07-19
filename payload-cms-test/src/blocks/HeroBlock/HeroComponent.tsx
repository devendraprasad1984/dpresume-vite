import React from 'react'
import type { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'

type blockProps = Extract<Page['Layouts'][0], { blockType: 'hero' }>
interface Props {
  block: blockProps
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
        <Image
          src={block.image?.url}
          alt={block.image?.alt || "image-media"}
          width={100}
          height={100}
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
          }}
        />
      )}
      <Link href={block.cta_button?.url as string}>{block.cta_button?.label}</Link>
    </div>
  )
}
export default HeroComponent
