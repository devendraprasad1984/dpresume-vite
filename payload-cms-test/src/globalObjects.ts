import { Cars } from '@/collections/cars'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/pages'
import { Header } from '@/globals/header'
import type { CollectionConfig, CollectionSlug, GlobalConfig } from 'payload'
import { Posts } from '@/collections/posts'
import {Categories} from "@/collections/Categories";

const collectionsObject = { Cars, Users, Media, Pages, Posts, Categories }
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
