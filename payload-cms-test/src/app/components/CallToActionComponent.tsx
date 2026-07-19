import React from 'react'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <a href={link.url as string}>{link.label}</a>
          })}
        </div>
      </div>
    </div>
  )
}
