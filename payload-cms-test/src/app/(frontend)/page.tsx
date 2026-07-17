import React from 'react'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'
import config from '@/payload.config'
import type { Page, Car } from '@/payload-types'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`
  const carsData = await payload.find({ collection: 'cars' })
  const pagesData = await payload.find({ collection: 'pages' })
  const cars: Car[] = carsData?.docs || []
  const pages: Page[] = pagesData?.docs || []
  // const car = cars?.[0] as Car
  // const page = pages?.[0] as Page
  return (
    <div className="col">
      <h2>CARS</h2>
      {cars.map((car) => {
        return (
          <div key={car.id}>
            Car: {car?.name} - {car?.alt} - {car?.built} - {car?.Year}
          </div>
        )
      })}
      <h2>PAGES</h2>
      {pages.map((page) => {
        return (
          <div key={page.id}>
            page: {page.name} - {page.message} - {page.createdAt}
          </div>
        )
      })}
    </div>
  )
}
