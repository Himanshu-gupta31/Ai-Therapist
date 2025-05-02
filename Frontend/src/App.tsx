import HomeSection from "./component/HomeSection"
import {Routes, Route} from 'react-router-dom'
import Navbar from "./component/Navbar"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"
import NotFound from "./component/NotFound"
import {GoogleOAuthProvider} from "@react-oauth/google"
import ScreenTimeCalculator from "./component/ScreenTimeCalculator"
import ScreenTimeAssistant from "./component/ScreenTimeAssistant"
import Dashboard from "./Pages/Dashboard"
import DailyPlanForm from "./Pages/DailyPlan"



function  App() {
  return (
    // Wrap the entire app with GoogleOAuthProvider so all components have access
    <GoogleOAuthProvider clientId="827631968097-k3kjnva2p203242qc75oapuj0bqcegh6.apps.googleusercontent.com">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeSection/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="*" element={<NotFound/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/dailyplan" element={<DailyPlanForm/>}/>
          
          

        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App