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
  const [showProfileModal, setShowProfileModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const verifyUser = async () => {
    setIsLoading(true)
    try {
      const response = await newRequest.get("/users/verify")
      if (response.status === 200) {
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    } catch (error) {
      setLoggedIn(false)
      // Don't log the error here - it's expected when not logged in
    } finally {
      setIsLoading(false)
    }
  }

  // Run verification on initial load and when location changes
  useEffect(() => {
    verifyUser()
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await newRequest.post("/users/logout")
      setLoggedIn(false)
      setShowProfileModal(false)
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal)
  }

  return (
    <div className="w-full bg-teal-200/70 px-4 relative border-b border-teal-100">
      <div className="flex w-full justify-between items-center py-2">
        {/* Logo and Brand */}
        <Link to="/" className="flex justify-center items-center">
          <img
            src={ScreenLife || "/placeholder.svg"}
            className="w-[4rem] h-[3.5rem] sm:w-[6rem] sm:h-[5rem]"
            alt="ScreenLife Logo"
          />
          <h1 className="text-teal-900 font-bold text-lg sm:text-xl">ScreenLife</h1>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none text-teal-700"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        

        {/* Desktop Auth Buttons or Profile Circle */}
        <div className="hidden md:flex">
          {isLoading ? (
            <span className="p-2 text-teal-600">Loading...</span>
          ) : loggedIn ? (
            <div className="relative">
              <div
                id="profile-button"
                className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors"
                onClick={toggleProfileModal}
              >
                <User size={20} color="white" />
              </div>

              {/* Profile Modal */}
              {showProfileModal && (
                <div
                  id="profile-modal"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden border border-teal-100"
                >
                  <div className="py-1">
                    <Link to="/dashboard">
                      <button className="w-full text-left px-4 py-2 text-teal-700 hover:bg-teal-50">Dashboard</button>
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-teal-50">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signup">
                <button className="bg-teal-100 p-2 rounded-xl mr-2 hover:bg-teal-200 text-teal-700">Sign Up</button>
              </Link>
              <Link to="/signin">
                <button className="bg-teal-500 p-2 rounded-xl hover:bg-teal-600 text-white">Sign In</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-teal-50 z-50 shadow-lg py-4 px-6 flex flex-col gap-4 border-t border-teal-100">
         

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            {isLoading ? (
              <span className="p-2 text-teal-600">Loading...</span>
            ) : loggedIn ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors"
                  onClick={toggleProfileModal}
                >
                  <User size={20} color="white" />
                </div>
                <span className="text-teal-700">Profile</span>
              </div>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="bg-teal-100 p-2 rounded-xl hover:bg-teal-200 w-full text-teal-700">Sign Up</button>
                </Link>
                <Link to="/signin" className="w-full sm:w-auto">
                  <button className="bg-teal-500 p-2 rounded-xl hover:bg-teal-600 w-full text-white">Sign In</button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Profile Modal */}
          {showProfileModal && loggedIn && (
            <div className="bg-white rounded-md shadow-lg overflow-hidden mt-2 border border-teal-100">
              <div className="py-1">
                <Link to="/dashboard">
                  <button className="w-full text-left px-4 py-2 text-teal-700 hover:bg-teal-50">Dashboard</button>
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-teal-50">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Navbar
