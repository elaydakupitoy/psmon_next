import StationsChart from "./StationChart";

export default function Page() {
  return (
    <div style={{ height: '100vh', width: '100%', margin: 0 }}> {/* Full viewport height and width */}
      <h1 style={{ textAlign: 'center', margin: 0, paddingTop: '20px' }}>Stations Graph</h1>
      <div style={{ height: 'calc(100vh - 60px)', width: '100%' }}> {/* Full width, subtracting header height */}
        <StationsChart />
      </div>
    </div>
  );
}
