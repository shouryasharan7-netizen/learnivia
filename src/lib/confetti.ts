import confetti from "canvas-confetti";

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: ["#0D683B", "#15803D", "#34D399", "#F59E0B", "#3B82F6"],
    disableForReducedMotion: true,
  });
}
