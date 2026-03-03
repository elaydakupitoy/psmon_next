import PSCard from "./PSCard"
import LiquidGauge from "./LiquidChart"

// type PS = {
//   name: string
//   percent: number | null
//   volume: string
//   time: string
//   alert?: boolean
//   wsUrl?: string
// }

// type SD = {
//   id: number;
//   name: string;
//   title?: string;
//   wsUrl?: string; 
// }

// export default function AreaSection({
//   title,
//   data
// }: {
//   title: string
//   data: SD[]
// }) {
//   return (
//     <section className="bg-gray-100 rounded-lg p-4 mb-6">



//       <h2 className="font-semibold mb-4 text-center">{title}</h2>

//       <div className="flex flex-wrap gap-4 justify-center">
//           {
//               data.map(sd => (
//                 /*  <PSCard key={ps.name} {...ps} /> */
      
        
//                 <LiquidGauge  key={sd.name} {...sd} />
//               ))
//          }
//       </div>


           
//     </section>
//   )
// }
export default function AreaSection({
  title,
  data
}: {
  title: string
  data: SD[]
}) {
  return (
    <section className="bg-gray-100 rounded-lg p-4 mb-6">

      <h2 className="font-semibold mb-4 text-center">{title}</h2>

      <div className="flex flex-wrap gap-6 justify-center">
        {data.map(sd => (
          <div
            key={sd.id}
            className="w-[260px] flex-shrink-0"
          >
            <LiquidGauge {...sd} />
          </div>
        ))}
      </div>

    </section>
  )
}