import type { SanitizedConfig } from 'payload'

import payload from 'payload'

// Script must define a "script" function export that accepts the sanitized config
export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })
  await payload.create({
    collection: 'pages',
    data: { name: 'test page' },
  })
  payload.logger.info('Successfully seeded!')
  process.exit(0)
}
