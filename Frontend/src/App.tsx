import HomeSection from "./component/HomeSection"
import {Routes,Route} from 'react-router-dom'
import Navbar from "./component/Navbar"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Routes>
      <Route path="/" element={<HomeSection/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </div>
  )
}

export default App