
function GitStreak() {
    const totalDots=365
  return (
    <div className='p-4 m-4 border border-gray-400'>
        <h2 className='text-xl font-semibold mb-4'>Habit Streak</h2>
        <div className='grid grid-cols-52 gap-1'>
            {Array.from({length:totalDots}).map((_,index)=>(
                <div key={index}
                className='w-4 h-4 bg-white rounded-sm border border-gray-300'
                >
                    
                </div>
            ))}
        </div>


    </div>
  )
}

export default GitStreak