import type { Car } from '@/payload-types'
import type { Payload } from 'payload'

interface Props {
  payload: Payload
}
const CarComponent = async (props: Props) => {
  const payload = props.payload
  const data = await payload.find({ collection: 'cars' })
  const cars: Car[] = data?.docs || []
  return (
    <div>
      <h2>CARS</h2>
      {cars.map((car) => {
        return (
          <div key={car.id}>
            Car: {car?.name} - {car?.alt} - {car?.built} - {car?.Year}
          </div>
        )
      })}
    </div>
  )
}
export default CarComponent
