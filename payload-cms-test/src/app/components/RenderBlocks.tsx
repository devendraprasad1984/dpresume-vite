import React from 'react'
import HeroComponent from '@/app/components/HeroComponent'
import type {
  HeroBlock as HeroProps,
  BannerBlock as BannerProps,
  CallToActionBlock as CTAProps,
} from '@/payload-types'
import { BannerBlockComponent } from '@/app/components/BannerBlockComponent'
import { FormComponent } from '@/app/components/FormComponent'

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
    return <BannerBlockComponent block={block} />
  } else if (blockType === 'forms-block') {
    return <FormComponent block={block} />
  } else {
    return null
  }
}

export default RenderBlocks
