import TabComponent from "./TabComponent"

function ScreenTimeAssistant(){
    return (
        <div className="w-screen min-h-screen">
           <div className="flex justify-center items-center font-semibold mt-16">
            <h1 className="text-4xl">Screen Time Assistant</h1>
           </div>
           <TabComponent/>
           <div></div>
        </div>
    )
}
export default ScreenTimeAssistant