interface GitStreakProps {
  checkInDates: string[];
}

function GitStreak({ checkInDates }: GitStreakProps) {
  const totalDots = 365;
  const today = new Date();
  const days = Array.from({ length: totalDots }).map((_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (totalDots - index - 1));
    // console.log(date)
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="p-4 m-4 border border-gray-400">
      <h2 className="text-xl font-semibold mb-4">Habit Streak</h2>
      <div className="grid grid-cols-52 gap-1">
        {days.map((date, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-sm border ${
              checkInDates.includes(date) ? "bg-green-500 border-green-700" : "bg-gray-200 border-gray-300"
            }`}
            title={date}
          />
        ))}
      </div>
    </div>
  );
}

export default GitStreak;
