import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleLogin from '../component/GoogleLogin' 
import { newRequest } from '@/utils/request'

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const Signup = async () => {
    setLoading(true)
    try {
      await newRequest.post("/users/signup", {
        email: email,
        password: password
      })
      navigate("/dashboard")
    } catch (error: any) {
      console.error("Error signing up!", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Error signing up! Please try again later.");
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    Signup()
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-black">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border-2 border-blue-400">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-400 text-black py-3 rounded-lg hover:bg-blue-500 transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          
          <div className="flex justify-center">
            <GoogleLogin />
          </div>
          
          <div className="text-center mt-4">
            <p>
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-blue-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp