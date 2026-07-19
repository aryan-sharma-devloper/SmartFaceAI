import { useEffect, useState } from "react";

function StatCard({ title, value, color, icon }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;

    if (end === 0) {
      setCount(0);
      return;
    }

    const duration = 1000;
    const stepTime = Math.max(10, duration / end);

    const timer = setInterval(() => {
      start += 1;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`rounded-2xl shadow-lg p-6 text-white ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg">{title}</h3>

          <p className="text-4xl font-bold mt-2">
            {count}
          </p>
        </div>

        <div className="text-5xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;