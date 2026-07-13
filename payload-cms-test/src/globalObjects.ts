import { Cars } from '@/collections/cars'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/pages'
import { Header } from '@/globals/header'
import { ContentTeaser } from '@/blocks/content-teaser'
import { ContentTeaserV2 } from './blocks/content-teaser-v2'
import { Banner } from '@/blocks/Banner/config'
import type { CollectionConfig, CollectionSlug, GlobalConfig } from 'payload'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Code } from '@/blocks/Code/config'

const collectionsObject = { Cars, Users, Media, Pages }
const globalsObject = { Header }

const allCollections = Object.values(collectionsObject)
const allGlobals = Object.values(globalsObject)

const collectionSlugs = allCollections.map((x: CollectionConfig) => {
  return x.slug as CollectionSlug
})
const collectionsCombined = [...allCollections, ...allGlobals].map(
  (x: CollectionConfig | GlobalConfig) => {
    return x.slug as CollectionSlug
  },
)

export const globalObjects = () => {
  return {
    collectionsObject,
    globalsObject,
    collectionSlugs,
    allCollections,
    allGlobals,
    collectionsCombined,
  }
}
