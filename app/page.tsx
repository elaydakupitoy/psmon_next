import AreaSection from "./component/AreaSection" 
import LiquidGauge from "./component/LiquidChart"
import Link from "next/link"
 

export default function Home() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">


      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Water Level Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time monitoring of pump stations</p>
        {/* Link to Station Chart */}
        <Link
          href="/stationchart"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View 24-Hour Chart
        </Link>
   
      </div>
      <AreaSection
        title="Poblacion Area"
        data={[
          { id:2, name: "PS2",  title: "PS2", wsUrl: "ws://localhost:8080/ps2" },
          { id:3,  name: "PS3",    title: "PS3", wsUrl: "ws://localhost:8080/ps3" },
          {id:8, name: "PS8",  title: "PS8", wsUrl: "ws://localhost:8080/ps8" },
        ]}
      />

      <AreaSection
        title="Cannery Area"
        data={[
          { id:4, name: "PS4",  title: "PS4", wsUrl: "ws://localhost:8080/ps4" },
          { id:5,  name: "PS5",    title: "PS5", wsUrl: "ws://localhost:8080/ps5" },
          {id:7, name: "PS7",  title: "PS7", wsUrl: "ws://localhost:8080/ps7" },
        ]}
      />


  {/* Bottom sections side by side */}
  <div className="grid md:grid-cols-2 gap-6">
    <AreaSection
      title="Sulit Area"
      data={[
        { id:1, name: "PS1", title: "PS1", wsUrl: "ws://localhost:8080/ps1" },
      ]}
    />

    <AreaSection
      title="Polo Area"
      data={[
        { id:6, name: "PS6", title: "PS6", wsUrl: "ws://localhost:8080/ps6" },
      ]}
    />
  </div>
     
    </main>
  )
}
