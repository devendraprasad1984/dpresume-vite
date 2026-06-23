import React from 'react'
import type { Payload } from 'payload'
import Link from 'next/link'
// import { getTranslation } from '@payloadcms/translations'
//use client
// import { useConfig } from '@payloadcms/ui'

interface thisProps {
  payload?: Payload
  helloWorld?: string
  field?: {
    name?: string
  }
  i18n: unknown
}
function LogoutButton(props: thisProps) {
  const payload = props.payload as Payload
  const helloWorld = props.helloWorld as string
    // const translatedTitle = getTranslation(myTranslation, props.i18n)
  // const config = useConfig()
  console.log('ssr logout button', payload?.collections?.users, 'serverProps:', props)
  return (
    <div className="flex col">
      <Link href={payload.config.serverURL}>Home</Link>
      <Link href="/admin/logout">hello-{helloWorld}</Link>
    </div>
  )
}

export default LogoutButton
