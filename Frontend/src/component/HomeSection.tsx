import {motion} from "motion/react"
function HomeSection() {
    return (
      <div className="w-full px-4">
        <div className="flex flex-col min-h-screen justify-center items-center text-center">
          <motion.h1
          initial={{opacity:0,y:-50}}
          animate={{opacity:1,y:0}}
          transition={{duration:1.2}}
          className="text-5xl font-bold text-[#333333] mb-6">Discover Your Screen Time Future</motion.h1>
          <p className="text-lg text-[#666666] max-w-2xl mb-10 px-4">
            Enter your daily screen time and problems to see how your life could look in the next 30 years — along with solutions to help you reduce it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-teal-500 text-white px-6 py-3 rounded-2xl shadow-md hover:bg-teal-700/80 border border-teal-700">Get Started</button>
            <button className="bg-transparent border border-[#333333] text-[#333333] px-6 py-3 rounded-2xl hover:bg-[#e0e0e0]">Learn More</button>
          </div>
        </div>
      </div>
    )
  }
  
  export default HomeSection