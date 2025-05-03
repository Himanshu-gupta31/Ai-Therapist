// "use client"

// import { useState } from "react"
// import Habit from "./Habit"
// import Chat from "./Chat"

// const tabs = [
//   { id: "Chat", label: "Chat" },
//   { id: "Habits", label: "My Habits" },
// ]

// function TabComponent() {
//   const [active, setActive] = useState("Chat")

//   return (
//     <div className="w-full max-w-2xl mx-auto mt-10">
//       <div className="flex justify-around bg-gray-300 p-2 rounded-lg">
//         {tabs.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActive(item.id)}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 mx-1
//               ${
//                 active === item.id
//                   ? "bg-white text-black shadow-md w-[48%]"
//                   : "bg-transparent text-gray-600 hover:bg-gray-200 w-[48%] hover:w-[46%]"
//               }`}
//           >
//             {item.label}
//           </button>
//         ))}
//       </div>
//       <div className="p-4 mt-4 border rounded-lg bg-white shadow-md">
//         {active === "Habits" && <Habit />}
//         {active === "Chat" && <Chat />}
//       </div>
//     </div>
//   )
// }

// export default TabComponent

