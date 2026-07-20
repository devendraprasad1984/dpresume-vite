import React from 'react'
import type { HeroBlock as HeroProps } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'
import Link from 'next/link'

// type blockProps = Extract<Page['Layouts'][], { blockType: 'hero' }>
interface Props {
  block: HeroProps
}

const HeroComponent = ({ block }: Props) => {
  const subHeadingBlock = block['subheading-1'] as SerializedEditorState<SerializedLexicalNode>
  console.log(process.env.NEXT_PUBLIC_SERVER_URL, block.image?.url)
  return (
    <div
      style={{
        border: '1px solid black',
        padding: '5px',
      }}
    >
      <h3>INSIDE HERO</h3>
      <h2 style={{ color: 'red' }}>{block.title}</h2>
      <RichText data={subHeadingBlock} />
      {typeof block.image === 'object' && block.image?.url && (
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${block.image?.url}`}
          alt={block.image?.alt || 'image-media'}
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
