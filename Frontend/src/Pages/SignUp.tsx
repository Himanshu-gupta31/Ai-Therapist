import { useState } from 'react'
import { Link } from 'react-router-dom'

function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your sign-up logic here
    
    console.log('Sign Up Attempt', { name, email, password })
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE59]"
              required 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE59]"
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE59]"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#FFDE59] text-black py-3 rounded-lg hover:bg-[#ffcc33] transition duration-300"
          >
            Sign Up
          </button>
          <div className="text-center mt-4">
            <p>
              Already have an account? {' '}
              <Link 
                to="/signin" 
                className="text-[#FFDE59] hover:underline"
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