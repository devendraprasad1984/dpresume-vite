import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, GlobalConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import type { CollectionConfig } from 'payload'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Cars } from '@/collections/cars'
import { Header } from '@/globals/header'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isDev = process.env.NODE_ENV === 'development'
const collectionsObject = [Cars, Users, Media]
const globalsObject = [Header]
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    meta: {
      titleSuffix: '- TRBL Design',
      favicon: '/assets/favicon.svg',
      ogImage: '/assets/logo.svg',
    },
    autoRefresh: isDev,
    autoLogin: isDev
      ? {
          email: 'devendraprasad1984@gmail.com',
          password: 'password',
          prefillOnly: true,
        }
      : false,
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      logout: {
        Button: {
          path: './app/components/LogoutButton',
          serverProps: { helloWorld: 'logout admin' },
        },
      },
    },
    livePreview: {
      url: 'http://localhost:3000',
      collections: [...collectionsObject, ...globalsObject].map((x: CollectionConfig | GlobalConfig) => {
        return x.slug
      }),
    },
  },
  collections: collectionsObject,
  globals: globalsObject,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
