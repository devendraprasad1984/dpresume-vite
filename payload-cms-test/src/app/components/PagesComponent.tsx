import type { Page } from '@/payload-types'
import type { Payload } from 'payload'

interface Props {
  payload: Payload
}

const PagesComponent = async (props: Props) => {
  const payload = props.payload
  const pagesData = await payload.find({ collection: 'pages' })
  const pages: Page[] = pagesData?.docs || []
  return (
    <div>
      <h2>Pages</h2>
      {pages.map((page) => {
        const layout = JSON.stringify(page?.Layouts?.[0], null, 2)
        return (
          <div key={page.id}>
            <br />
            page: {page.name} - {page.message} - {page.createdAt}
            <br />
            PAGE LAYOUT: {layout}
          </div>
        )
      })}
    </div>
  )
}
export default PagesComponent
