import React from 'react'
// import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
// import { fileURLToPath } from 'url'
import config from '@/payload.config'
import type { Page } from '@/payload-types'
import './styles.css'
import CarComponent from '@/app/components/CarComponent'
import PagesComponent from '@/app/components/PagesComponent'

export default async function HomePage() {
  // const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  // const { user } = await payload.auth({ headers })
  // const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`
  return (
    <div className="col">
      <CarComponent payload={payload} />
      <PagesComponent payload={payload} />
    </div>
  )
}
