"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import ScreenLife from "/ScreenLife.png"
import { useEffect, useState } from "react"
import { newRequest } from "@/utils/request"
import { Menu, X, User } from "lucide-react"

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const verifyUser = async () => {
    setIsLoading(true)
    try {
      const response = await newRequest.get("/users/verify")
      setLoggedIn(response.status === 200)
    } catch {
      setLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    verifyUser()
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await newRequest.post("/users/logout")
      setLoggedIn(false)
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="w-full bg-black text-white border-b border-green-100 px-2 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={ScreenLife}
              alt="ScreenLife Logo"
              className="w-[3.5rem] h-[3.5rem] sm:w-[4.5rem] sm:h-[4.5rem] text-green-400"
            />
            <span className="text-green-500 font-bold text-xl">Habit Tracker</span>
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex gap-8 text-green-200">
          <Link to="/pricing" className="hover:text-green-300 transition-colors">Pricing</Link>
          <Link to="/features" className="hover:text-green-300 transition-colors">Features</Link>
          <Link to="/how-it-works" className="hover:text-green-300 transition-colors">How it Works</Link>
        </div>

        {/* Right Side - Auth / Profile */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <span className="text-green-500">Loading...</span>
          ) : loggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Logout
              </button>
              <Link to="/dashboard">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <User size={20} color="white" />
                </div>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600">Sign In</button>
              </Link>
              <Link to="/signup">
                <button className="bg-green-100 text-green-700 px-4 py-2 rounded-xl hover:bg-green-200">Sign Up</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 px-2 flex flex-col gap-4 bg-black text-green-100">
          <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link to="/features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>

          {isLoading ? (
            <span className="text-green-500">Loading...</span>
          ) : loggedIn ? (
            <>
              <Link to="/dashboard" className="mt-2 text-green-300" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <button className="bg-green-500 text-white px-4 py-2 rounded-xl w-full">Sign In</button>
              </Link>
              <Link to="/signup">
                <button className="bg-green-100 text-green-700 px-4 py-2 rounded-xl w-full">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
