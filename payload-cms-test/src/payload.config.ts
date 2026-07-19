import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { pino } from 'pino'
import pinoPretty from 'pino-pretty'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { globalObjects } from '@/globalObjects'
import { globalBlocks } from '@/globalBlocks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isDev = process.env.NODE_ENV === 'development'
const logger = pino({ level: 'debug' }, pinoPretty({ colorize: true }))

const _thisCollections = globalObjects()
const _thisBlocks = globalBlocks()
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
      collections: _thisCollections.collectionSlugs,
    },
  },
  collections: _thisCollections.allCollections,
  globals: _thisCollections.allGlobals,
  blocks: _thisBlocks.allBlocks,
  plugins: [
    formBuilderPlugin({
      defaultToEmail: 'test@example.com',
      redirectRelationships: ['pages'],
      beforeEmail: (emailsToSend, beforeChangeParams) => {
        // modify the emails in any way before they are sent
        return emailsToSend.map((email) => ({
          ...email,
          html: email.html,
        }))
      },
      fields: {
        text: true,
        textarea: true,
        select: true,
        radio: true,
        email: true,
        state: true,
        country: true,
        checkbox: true,
        number: true,
        message: true,
        date: true,
        payment: false,
        // upload: {
        //   uploadCollections: [_thisCollections.collectionsObject.Media.slug],
        // },
      },
      formOverrides: {
        slug: 'forms',
        access: {
          read: ({ req: { user } }) => !!user, // authenticated users only
          update: () => false,
        },
        fields: ({ defaultFields }) => {
          return [
            ...defaultFields,
            {
              name: 'custom',
              type: 'text',
            },
          ]
        },
      },
      // formSubmissionOverrides: {
      //   fields: ({ defaultFields }) => {
      //     return [
      //       ...defaultFields,
      //       {
      //         name: 'custom',
      //         type: 'text',
      //       },
      //     ]
      //   },
      // },
    }),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
})
