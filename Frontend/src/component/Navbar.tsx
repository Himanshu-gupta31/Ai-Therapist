"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import Habitude from "../assets/Habitude-removebg-preview.png"
import { useEffect, useState } from "react"
import { newRequest } from "@/utils/request"
import { Menu, X, User } from "lucide-react"
import Coins from "../assets/Coins.png"

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [coins, setCoins] = useState(0)

  const getCoins = async () => {
    try {
      const response = await newRequest.get("/users/getcoins")
      setCoins(response.data.allCoins.coins)
    } catch (error) {
      console.log("Error")
    }
  }

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

  useEffect(() => {
    if (loggedIn) {
      getCoins()
    }
  })

  return (
    <nav className="w-full bg-black text-white border-b border-blue-100 px-2 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Habitude || "/placeholder.svg"}
              alt="Habitude logo Logo"
              className="w-[3.5rem] h-[10.5rem] sm:w-[4.5rem] sm:h-[4.5rem] bg-black rounded-full"
            />
            <span className="text-blue-500 font-bold text-xl">Habitude</span>
          </Link>
        </div>

        {/* Center Navigation - Removed all links */}
        <div className="hidden md:flex gap-8 text-blue-200">{/* Links removed */}</div>

        {/* Right Side - Auth / Profile */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <span className="text-blue-500">Loading...</span>
          ) : loggedIn ? (
            <div className="flex items-center gap-2">
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600">
                Logout
              </button>
              <Link to="/dashboard">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <User size={20} color="white" />
                </div>
              </Link>
              <div
                className="flex items-center gap-1 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5 rounded-full border border-blue-700 hover:brightness-110 transition-all"
                title="Your current coins"
              >
                <img src={Coins} className="w-5 h-5 object-contain" alt="Coins" />
                <span className="font-medium text-yellow-100">{coins}</span>
              </div>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">Sign In</button>
              </Link>
              <Link to="/signup">
                <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200">Sign Up</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-blue-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - Removed all links */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 px-2 flex flex-col gap-4 bg-black text-blue-100">
          {/* Links removed */}

          {isLoading ? (
            <span className="text-blue-500">Loading...</span>
          ) : loggedIn ? (
            <>
              <Link to="/dashboard" className="mt-2 text-blue-300" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 p-3 rounded-lg border border-blue-700 my-2">
                <img src={Coins || "/placeholder.svg"} className="w-5 h-5 object-contain" alt="Coins" />
                <span className="font-medium text-yellow-100">{coins} coins</span>
              </div>
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-xl w-full">Sign In</button>
              </Link>
              <Link to="/signup">
                <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl w-full">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
