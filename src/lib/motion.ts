import type { Transition } from "motion/react";

/**
 * Emil Kowalski Motion Presets — Physics-based springs
 * replacing linear/ease curves with natural, tangible physical motion.
 */
export const springs = {
  // Snappy: For micro-interactions, buttons, active pill tabs, toggles
  snappy: {
    type: "spring",
    stiffness: 450,
    damping: 32,
    mass: 0.8,
  } as Transition,

  // Smooth: For cards, drawers, sheet expansions, modals
  smooth: {
    type: "spring",
    stiffness: 280,
    damping: 28,
    mass: 1,
  } as Transition,

  // Bouncy: For celebration moments, checkmarks, badges, delight pings
  bouncy: {
    type: "spring",
    stiffness: 380,
    damping: 18,
    mass: 0.8,
  } as Transition,

  // Gentle: For floating hero cards, background glows, ambient movement
  gentle: {
    type: "spring",
    stiffness: 160,
    damping: 24,
    mass: 1.2,
  } as Transition,
};

// Staggered Fade Up for Lists & Grids
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      type: "spring",
      stiffness: 320,
      damping: 26,
    },
  }),
};

// Staggered Container
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Interactive Card Hover & Tap
export const cardHoverMotion = {
  whileHover: {
    y: -4,
    transition: springs.snappy,
  },
  whileTap: {
    scale: 0.98,
    transition: springs.snappy,
  },
};

// Interactive Button Press
export const buttonMotion = {
  whileHover: {
    scale: 1.02,
    transition: springs.snappy,
  },
  whileTap: {
    scale: 0.96,
    transition: springs.snappy,
  },
};
