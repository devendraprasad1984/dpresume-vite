import React from 'react'
import type { Payload } from 'payload'
import Link from 'next/link'

interface thisProps {
  payload?: Payload
  helloWorld?: string
}
function LogoutButton(props: thisProps) {
  const payload = props.payload as Payload
  const helloWorld = props.helloWorld as string
  console.log('ssr logout button', payload?.collections?.users, 'serverProps:', props)
  return <Link href="/admin/logout">hello-{helloWorld}</Link>
}

export default LogoutButton
