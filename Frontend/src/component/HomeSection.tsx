import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

function HomeSection() {
  return (
    <div className="w-full bg-black min-h-screen">
      {/* Light Effect// */}
      <div className="w-full h-140 flex justify-center items-center flex-col relative text-center px-4 ">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-linear-to-r from-blue-500/20 to-blue-600/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-linear-to-r from-blue-400/10 to-blue-300/5 blur-[80px]" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-5xl font-bold z-10"
        >
          Build Better Habits,
          <br />
          <span className="text-blue-500">Transform Your Life</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white mt-4 max-w-xl z-10"
        >
          Track, analyze, and improve your daily habits with our intuitive
          platform designed to help you achieve your goals.
        </motion.p>

        <motion.div
          className="flex gap-4 mt-8 z-10 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link to="/signup">
            <Button className="bg-blue-700 cursor-pointer">Get Started</Button>
          </Link>
          <Button className="bg-white text-blue-400 cursor-pointer">
            See How it Works :
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </Button>
        </motion.div>
      </div>
      {/* Features */}
      <div className="py-20 bg-black/80 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Features That <span className="text-blue-500">Drive Results</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-green-800 transition-all">
              <div className="bg-green-600/10 p-3 rounded-lg w-fit mb-6">
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Habit Tracking</h3>
              <p className="text-gray-400">
                Easily track your daily habits with our intuitive interface. Set
                goals and monitor your progress over time.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-blye-800 transition-all">
              <div className="bg-blue-600/10 p-3 rounded-lg w-fit mb-6">
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Insightful Analytics</h3>
              <p className="text-gray-400">
                Gain valuable insights with detailed analytics that help you
                understand your behavior patterns.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-green-800 transition-all">
              <div className="bg-green-600/10 p-3 rounded-lg w-fit mb-6">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Reminders</h3>
              <p className="text-gray-400">
                Never miss a habit with customizable reminders that adapt to
                your schedule and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection;
