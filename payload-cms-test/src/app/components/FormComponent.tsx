'use client'

import React from 'react'
import type { FormsBlock as FormProps } from '@/payload-types'

interface Props {
  block: FormProps
}

export const FormComponent: React.FC<Props> = ({ block }) => {
  const isSubscribeForm = block.id === 'subscribe_form'
  const isFormObject = typeof block.form === 'object'
  const formInsideObject = block.form?.value
  const valueIsObject = typeof formInsideObject === 'object'
  const formFields = (valueIsObject && block.form?.value?.fields) || []

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault()
  }

  if (!isFormObject) {
    return
  }
  return (
    <div
      style={{
        border: '1px solid pink',
        padding: '5px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2>
        {block.heading} - subscribe_form: {isSubscribeForm}
      </h2>
      <form onSubmit={handleSubmit} className="col">
        {formFields.map((field: any) => {
          return (
            <div key={field.id} className="col">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.blockType}
                name={field.name}
                style={{
                  padding: '5px',
                  border: '1px solid gray',
                  borderRadius: '5px',
                }}
              />
            </div>
          )
        })}
        <div>
          <button type="submit" onSubmit={handleSubmit}>
            {(formInsideObject['submitButtonLabel'] as string) || 'Submit'}
          </button>
        </div>
      </form>
      {/*<pre>{JSON.stringify(block.form, null, 2)}</pre>*/}
    </div>
  )
}
