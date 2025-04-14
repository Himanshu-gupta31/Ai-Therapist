import {useGoogleLogin} from "@react-oauth/google"
import { googleAuth } from "../utils/request"
import { useNavigate } from "react-router-dom";
function GoogleLogin() {
  const navigate=useNavigate()
    const responseGoogle=async(authResult:any)=>{
         try {
            if(authResult['code']){
               const result=await googleAuth(authResult['code']);
              //  console.log(result)
               const { email } = result.data.user; 
               console.log("User Email:", email);
               navigate("/dashboard")
            }
         } catch (error) { 
            console.error("Errro while requesting google code:",error)
         }
    }
    const googleLogin=useGoogleLogin({
        onSuccess:responseGoogle,
        onError:responseGoogle,
        flow:'auth-code'
    })

    
  return (
    <div >
        <button className='bg-gray-100 px-4 py-2 rounded flex items-center gap-2' onClick={() => googleLogin()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
        </svg>
        Login With Google
      </button>
    </div>
  )
}

export default GoogleLogin