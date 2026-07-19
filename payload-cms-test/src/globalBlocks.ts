import { ContentTeaser } from '@/blocks/content-teaser'
import { ContentTeaserV2 } from './blocks/content-teaser-v2'
import { Banner } from '@/blocks/Banner/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Code } from '@/blocks/Code/config'
import { HeroBlock } from '@/blocks/HeroBlock/config'
import { NewsLetterBlock } from '@/blocks/newsLetterBlock'

const globalsBlocks = {
  ContentTeaser,
  ContentTeaserV2,
  Banner,
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
