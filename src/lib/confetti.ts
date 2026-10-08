"use client";

export async function fireConfetti() {
  const confetti = (await import("canvas-confetti")).default;

  const durationMs = 1400;
  const end = Date.now() + durationMs;

  const colors = ["#10b981", "#34d399", "#fbbf24", "#60a5fa", "#f472b6"];

  confetti({
    particleCount: 90,
    spread: 78,
    origin: { y: 0.62 },
    colors,
  });

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}