import { Cars } from '@/collections/cars'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/pages'
import { Header } from '@/globals/header'
import { ContentTeaser } from '@/blocks/content-teaser'

const collectionsObject = { Cars, Users, Media, Pages }
const globalsObject = { Header }
const globalsBlocks = { ContentTeaser }

export const globalObjects = {
  collectionsObject,
  globalsObject,
  globalsBlocks,
}
