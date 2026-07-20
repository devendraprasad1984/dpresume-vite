'use client'

import React, { useState } from 'react'
import type { FormsBlock as FormProps } from '@/payload-types'

interface Props {
  block: FormProps
}

export const FormComponent: React.FC<Props> = ({ block }) => {
  const [_form, setForm] = useState({})
  const isSubscribeForm = block.id === 'subscribe_form'
  const isFormObject = typeof block.form === 'object' && block.form
  const formInsideObject = block.form?.value
  const valueIsObject = typeof formInsideObject === 'object'
  const formFields = (valueIsObject && block.form?.value?.fields) || []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormObject || !formInsideObject.id) {
      return
    }
    const newFormData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(newFormData.entries())
    const formSubmissionEntries = Object.entries(data)?.map(([field, value]) => {
      return {
        field,
        value,
      }
    })
    const formSubmissionData = {
      form: formInsideObject.id,
      submissionData: formSubmissionEntries,
    }
    console.log(formInsideObject, data, formSubmissionEntries, formSubmissionData)
    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        body: JSON.stringify(formSubmissionData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('form submission failed')
      }
      console.log('form response', response)
    } catch (err) {
      console.error(err)
    }
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
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  )
}
