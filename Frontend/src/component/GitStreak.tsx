import { useEffect, useState } from "react";
import { newRequest } from "@/utils/request";

function GitStreak() {
  const [checkInDates, setCheckInDates] = useState<string[]>([]);
  const totalDots = 365;

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const response = await newRequest.get("/users/streak");
        setCheckInDates(response.data.formattedUser.checkInDates);
      } catch (error) {
        console.error("Error fetching streak data:", error);
      }
    };

    fetchStreakData();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-4 m-4 border border-gray-400">
      <h2 className="text-xl font-semibold mb-4">Habit Streak</h2>
      <div className="grid grid-cols-52 gap-1">
        {Array.from({ length: totalDots }).map((_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (totalDots - index));
          const dateString = date.toISOString().split("T")[0];

          const isCheckedIn = checkInDates.includes(dateString);

          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-sm border border-gray-300 ${
                isCheckedIn ? "bg-green-500" : "bg-white"
              }`}
              title={dateString} // Show date on hover
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default GitStreak;
