import { ContentTeaser } from '@/blocks/content-teaser'
import { ContentTeaserV2 } from './blocks/content-teaser-v2'
import { BannerBlock } from '@/blocks/bannerBlock'
import { MediaBlock } from '@/blocks/mediaBlock'
import { CallToAction } from '@/blocks/callToActionBlock'
import { Code } from '@/blocks/Code/config'
import { HeroBlock } from '@/blocks/heroBlock'
import { NewsLetterBlock } from '@/blocks/newsLetterBlock'

const globalsBlocks = {
  ContentTeaser,
  ContentTeaserV2,
  Banner: BannerBlock,
  MediaBlock,
  CallToAction,
  Code,
  HeroBlock,
  NewsLetterBlock,
}

const allBlocks = Object.values(globalsBlocks)

export const globalBlocks = () => {
  return {
    globalsBlocks,
    allBlocks,
  }
}
