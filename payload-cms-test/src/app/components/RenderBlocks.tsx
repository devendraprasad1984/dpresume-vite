import React from 'react'
import HeroComponent from '@/blocks/HeroBlock/HeroComponent'
import { BannerBlock } from '@/blocks/Banner/Component'
import type {
  HeroBlock as HeroProps,
  BannerBlock as BannerProps,
  CallToActionBlock as CTAProps,
} from '@/payload-types'

interface Props {
  blockType: string
  block: null | string | HeroProps | BannerProps | CTAProps
}
const RenderBlocks = (props: Props): React.ReactNode => {
  const blockType = props.blockType
  const block = props.block
  if (blockType === 'hero') {
    return <HeroComponent block={block} />
  } else if (blockType === 'banner') {
    return <BannerBlock block={block} />
  } else {
    return null
  }
}

export default RenderBlocks
