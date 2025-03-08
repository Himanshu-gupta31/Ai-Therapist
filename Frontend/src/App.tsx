import HomeSection from "./component/HomeSection"
import {Routes,Route} from 'react-router-dom'
import Navbar from "./component/Navbar"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"
import NotFound from "./component/NotFound"
import {GoogleOAuthProvider} from "@react-oauth/google"
import GoogleLogin from "./component/GoogleLogin"
function App() {
  const GoogleAuthWrapper = () => (
    <GoogleOAuthProvider clientId="827631968097-k3kjnva2p203242qc75oapuj0bqcegh6.apps.googleusercontent.com">
      <GoogleLogin />
    </GoogleOAuthProvider>
  )
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Routes>
      <Route path="/" element={<HomeSection/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="*" element={<NotFound/>}/>
      <Route path="/login" element={<GoogleAuthWrapper/>}/>
      

      </Routes>
    </div>
  )
}

export default App