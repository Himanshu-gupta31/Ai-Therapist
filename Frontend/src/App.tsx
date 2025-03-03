import HomeSection from "./component/Homesection"
import Navbar from "./component/Navbar"

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HomeSection />
      </main>
    </div>
  )
}

export default App