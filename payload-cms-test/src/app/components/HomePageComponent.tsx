import type { Page } from '@/payload-types'
import type { Payload } from 'payload'

interface Props {
  payload: Payload
}

const PagesComponent = async (props: Props) => {
  const payload = props.payload
  const homePageData = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
  })
  const homePage: Page = homePageData?.docs?.[0]
  const layouts = homePage.Layouts
  return (
    <div>
      <h2>Home</h2>
      <div>
        {homePage.name} - {homePage.message}
      </div>
      {layouts.map((layout, index) => {
        return (
          <div>
            <h1>Layout: {layout.blockType}</h1>
            <pre key={layout.id}>{JSON.stringify(layout, null, 2)}</pre>
          </div>
        )
      })}
    </div>
  )
}
export default PagesComponent
