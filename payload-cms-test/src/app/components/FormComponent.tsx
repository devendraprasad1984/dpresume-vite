import React from 'react'
import type { Form } from '@/payload-types'

interface Props {
  block: Form
}

export const FormComponent: React.FC<Props> = ({ block }) => {
  return (
    <div
      style={{
        border: '1px solid pink',
        padding: '5px',
      }}
    >
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  )
}
