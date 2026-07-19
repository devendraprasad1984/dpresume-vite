import type { Page } from '@/payload-types'
import type { Payload } from 'payload'
import RenderBlocks from '@/app/components/RenderBlocks'

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
  const layouts = homePage.Layouts as Page["Layouts"] || []
  return (
    <div>
      <h2>Home</h2>
      <div>
        {homePage.name} - {homePage.message}
      </div>
      {layouts.map((layout, index) => {
        return (
          <div key={layout.id}>
            <h1>Layout: {layout.blockType}</h1>
            <RenderBlocks blockType={layout.blockType} block={layout} />
          </div>
        )
      })}
      <hr />
    </div>
  )
}
export default PagesComponent
