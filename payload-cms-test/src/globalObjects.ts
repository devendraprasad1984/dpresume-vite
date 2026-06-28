import { Cars } from '@/collections/cars'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/pages'
import { Header } from '@/globals/header'
import { ContentTeaser } from '@/blocks/content-teaser'
import { ContentTeaserV2 } from './blocks/content-teaser-v2'

const collectionsObject = { Cars, Users, Media, Pages }
const globalsObject = { Header }
const globalsBlocks = { ContentTeaser, ContentTeaserV2 }

export const globalObjects = () => {
  return {
    collectionsObject,
    globalsObject,
    globalsBlocks,
  }
}
