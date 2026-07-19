import React from 'react'
import HeroComponent from '@/app/components/HeroComponent'
import type {
  HeroBlock as HeroProps,
  BannerBlock as BannerProps,
  CallToActionBlock as CTAProps,
  Form as FormProps,
} from '@/payload-types'
import { BannerBlockComponent } from '@/app/components/BannerBlockComponent'
import { FormComponent } from '@/app/components/FormComponent'

interface Props {
  blockType: string
  block: HeroProps | BannerProps | CTAProps | FormProps
}
const RenderBlocks = (props: Props): React.ReactNode => {
  const blockType = props.blockType
  const block = props.block
  if (blockType === 'hero') {
    return <HeroComponent block={block as HeroProps} />
  } else if (blockType === 'banner') {
    return <BannerBlockComponent block={block as BannerProps} />
  } else if (blockType === 'forms-block') {
    return <FormComponent block={block as FormProps} />
  } else {
    return null
  }
}

export default RenderBlocks
