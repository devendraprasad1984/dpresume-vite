import React from 'react'
import type { ViewDescriptionClientProps } from 'payload'

export function MyDescComponent(props: ViewDescriptionClientProps) {
  console.log('MyDescComponent', props)
  return <div>Desc: {props.description as string}</div>
}
