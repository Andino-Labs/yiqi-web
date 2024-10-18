"use client";

import { useState, useEffect } from "react";

const halloweenEmojis = [
  "🎃",
  "🎃",
  "👻",
  "🦇",
  "🕷️",
  "🕸️",
  "🕸️",
  "🧙‍♀️",
  "🧛‍♂️",
  "🧟‍♂️",
  "🔮",
];

interface FallingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  rotation: number;
}

export default function HalloweenBackground() {
  const [emojis, setEmojis] = useState<FallingEmoji[]>([]);

  useEffect(() => {
    const numEmojis = Math.floor(Math.random() * 20) + 10; // 10 to 30 emojis
    const newEmojis: FallingEmoji[] = [];

    for (let i = 0; i < numEmojis; i++) {
      newEmojis.push({
        id: i,
        emoji:
          halloweenEmojis[Math.floor(Math.random() * halloweenEmojis.length)],
        x: Math.random() * 100,
        y: -Math.random() * 100,
        speed: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * 360,
      });
    }

    setEmojis(newEmojis);

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animate = () => {
    setEmojis((prevEmojis) =>
      prevEmojis.map((emoji) => ({
        ...emoji,
        y: emoji.y > 100 ? -10 : emoji.y + emoji.speed,
        rotation: (emoji.rotation + emoji.speed * 2) % 360,
      })),
    );

    requestAnimationFrame(animate);
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl"
          style={{
            left: `${emoji.x}%`,
            top: `${emoji.y}%`,
            transform: `rotate(${emoji.rotation}deg)`,
            transition: "top 0.1s linear, transform 0.1s linear",
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
}
