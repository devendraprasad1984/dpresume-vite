import { mongooseAdapter } from '@payloadcms/db-mongodb'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { pino } from 'pino'
import pinoPretty from 'pino-pretty'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { globalObjects } from '@/globalObjects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isDev = process.env.NODE_ENV === 'development'
const logger = pino({ level: 'debug' }, pinoPretty({ colorize: true }))

const _this = globalObjects()
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  logger,
  admin: {
    meta: {
      titleSuffix: '- TRBL Design',
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
      collections: _this.collectionSlugs,
    },
  },
  collections: _this.allCollections,
  globals: _this.allGlobals,
  blocks: _this.allBlocks,
  plugins: [],
  editor: lexicalEditor({
    features: ({ rootFeatures }) => {
      return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
})
