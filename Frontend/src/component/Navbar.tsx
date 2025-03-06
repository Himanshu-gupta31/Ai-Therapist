import { Link } from "react-router-dom"
import ScreenLife from "/ScreenLife.png"
function Navbar(){
    return (
        <div className="w-full bg-lemon px-4">
            <div className="flex w-full justify-between items-center">
            <div className="flex justify-center items-center">
                <img src={ScreenLife} className="w-[6rem] h-[5rem]"/>
                <h1 className="text-black font-bold text-xl">ScreenLife</h1>
            </div>
            <div className="flex justify-center items-center">
                <p className="text-yellow-500 text-lg font-semi-bold mr-2 cursor-pointer hover:underline hover:text-amber-700">How It Works</p>
                <p className="text-lg font-semi-bold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">Benefits</p>
                <p className="text-lg font-semi-bold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">Testimonals</p>
                <a href="https://x.com/Himanshuu3112" target="_blank">
                <p className="text-lg font-semi-bold mr-2 ml-2 cursor-pointer hover:underline hover:text-amber-700">Contact</p>
                </a>
            </div>
            <div className="flex">
                <Link to="/signup">
                <button className="bg-orange-200 p-2 rounded-xl mr-2 hover:bg-amber-200">Sign Up </button>
                </Link>
                <Link to="/signin">
                <button className="bg-orange-200 p-2 rounded-xl hover:bg-amber-200">Sign In </button>
                </Link>
            </div>
            </div>
          
        </div>
    )
}
export default Navbar