import type { Page } from '@/payload-types'
import type { Payload } from 'payload'

interface Props {
  payload: Payload
}

const PagesComponent = async (props: Props) => {
  const payload = props.payload
  const data = await payload.find({ collection: 'pages' })
  const pages: Page[] = data?.docs || []
  return (
    <div>
      <h2>Pages</h2>
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
export default PagesComponent
