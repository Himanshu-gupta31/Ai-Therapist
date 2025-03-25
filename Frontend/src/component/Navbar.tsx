import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import ScreenLife from "/ScreenLife.png";
import { newRequest } from "@/utils/request";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await newRequest.get("/users/verify");
        if (response.status === 200) {
          setLoggedIn(true);
        }
      } catch (error) {
        setLoggedIn(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/users/logOut");
      setLoggedIn(false);
      setIsMenuOpen(false); 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="w-full bg-lemon px-4 relative">
      <div className="flex w-full justify-between items-center">
        {/* Logo Section */}
        <div className="flex justify-center items-center">
          <img src={ScreenLife} alt="ScreenLife Logo" className="w-[6rem] h-[5rem]" />
          <h1 className="text-black font-bold text-xl">Fix Me</h1>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:bg-amber-100 rounded-lg"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-center items-center">
          <p className="text-yellow-500 text-lg font-semi-bold mr-2 cursor-pointer hover:underline hover:text-amber-700">
            How It Works
          </p>
          <p className="text-lg font-semi-bold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">
            Benefits
          </p>
          <p className="text-lg font-semi-bold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">
            Testimonals
          </p>
          <a
            href="https://x.com/Himanshuu3112"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-lg font-semi-bold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">
              Contact
            </p>
          </a>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-orange-200 p-2 rounded-xl hover:bg-amber-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/signup">
                <button className="bg-orange-200 p-2 rounded-xl mr-2 hover:bg-amber-200">
                  Sign Up
                </button>
              </Link>
              <Link to="/signin">
                <button className="bg-orange-200 p-2 rounded-xl hover:bg-amber-200">
                  Sign In
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-lemon shadow-lg z-50">
          <div className="flex flex-col p-4 space-y-4">
            <p className="text-yellow-500 text-lg font-semi-bold cursor-pointer hover:underline hover:text-amber-700">
              How It Works
            </p>
            <p className="text-lg font-semi-bold cursor-pointer hover:underline hover:text-amber-700">
              Benefits
            </p>
            <p className="text-lg font-semi-bold cursor-pointer hover:underline hover:text-amber-700">
              Testimonals
            </p>
            <a
              href="https://x.com/Himanshuu3112"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semi-bold cursor-pointer hover:underline hover:text-amber-700"
            >
              Contact
            </a>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 pt-4 border-t border-amber-200">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-orange-200 p-2 rounded-xl hover:bg-amber-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/signup">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-orange-200 p-2 rounded-xl hover:bg-amber-200"
                    >
                      Sign Up
                    </button>
                  </Link>
                  <Link to="/signin">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-orange-200 p-2 rounded-xl hover:bg-amber-200"
                    >
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
