"use client"

import { Link, useNavigate } from "react-router-dom"
import ScreenLife from "/ScreenLife.png"
import { useEffect, useState } from "react"
import { newRequest } from "@/utils/request"
import { Menu, X } from "lucide-react"

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const verifyUser = async () => {
    try {
      const response = await newRequest.get("/users/verify")
      if (response.status === 200) {
        setLoggedIn(true)
      }
    } catch (error) {
      setLoggedIn(false)
    }
  }

  useEffect(() => {
    verifyUser()
  }, [])

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard")
    }
  },[])

  const handleLogout = async () => {
    try {
      await newRequest.post("/users/logout")
      setLoggedIn(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="w-full bg-lemon px-4 relative">
      <div className="flex w-full justify-between items-center py-2">
        {/* Logo and Brand */}
        <div className="flex justify-center items-center">
          <img
            src={ScreenLife || "/placeholder.svg"}
            className="w-[4rem] h-[3.5rem] sm:w-[6rem] sm:h-[5rem]"
            alt="ScreenLife Logo"
          />
          <h1 className="text-black font-bold text-lg sm:text-xl">Fix Me</h1>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center">
          <p className="text-yellow-500 text-lg font-semibold mr-2 cursor-pointer hover:underline hover:text-amber-700">
            How It Works
          </p>
          <p className="text-lg font-semibold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">
            Benefits
          </p>
          <p className="text-lg font-semibold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">
            Testimonials
          </p>
          <a href="https://x.com/Himanshuu3112" target="_blank" rel="noopener noreferrer">
            <p className="text-lg font-semibold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">
              Contact
            </p>
          </a>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex">
          {loggedIn ? (
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600">
              Logout
            </button>
          ) : (
            <>
              <Link to="/signup">
                <button className="bg-orange-200 p-2 rounded-xl mr-2 hover:bg-amber-200">Sign Up</button>
              </Link>
              <Link to="/signin">
                <button className="bg-orange-200 p-2 rounded-xl hover:bg-amber-200">Sign In</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-lemon z-50 shadow-lg py-4 px-6 flex flex-col gap-4 border-t border-amber-200">
          <p className="text-yellow-500 text-lg font-semibold cursor-pointer hover:underline hover:text-amber-700">
            How It Works
          </p>
          <p className="text-lg font-semibold cursor-pointer hover:underline hover:text-amber-700">Benefits</p>
          <p className="text-lg font-semibold cursor-pointer hover:underline hover:text-amber-700">Testimonials</p>
          <a href="https://x.com/Himanshuu3112" target="_blank" rel="noopener noreferrer">
            <p className="text-lg font-semibold cursor-pointer hover:underline hover:text-amber-700">Contact</p>
          </a>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 w-full sm:w-auto"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="bg-orange-200 p-2 rounded-xl hover:bg-amber-200 w-full">Sign Up</button>
                </Link>
                <Link to="/signin" className="w-full sm:w-auto">
                  <button className="bg-orange-200 p-2 rounded-xl hover:bg-amber-200 w-full">Sign In</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar

