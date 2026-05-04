import { useEffect, useState } from "react";

export default function Timer({ initial }: { initial: number }) {
  const [time, setTime] = useState(initial);

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const min = Math.floor(time / 60);
  const sec = time % 60;

  return (
    <div className="font-semibold">
      ⏱ {min}:{sec.toString().padStart(2, "0")}
    </div>
  );
}