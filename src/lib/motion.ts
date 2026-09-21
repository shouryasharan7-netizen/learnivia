import type { Transition } from "motion/react";

/**
 * Emil Kowalski Motion Presets - Physics-based springs
 * replacing linear/ease curves with natural, tangible physical motion.
 */
export const springs = {
  // Snappy: For micro-interactions, buttons, active pill tabs, toggles
  snappy: {
    duration: 0.15,
    ease: [0.16, 1, 0.3, 1],
  } as Transition,

  // Smooth: For cards, drawers, sheet expansions, modals
  smooth: {
    duration: 0.22,
    ease: [0.16, 1, 0.3, 1],
  } as Transition,

  // Gentle: For opacity reveals and smooth fades
  gentle: {
    duration: 0.28,
    ease: [0.16, 1, 0.3, 1],
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
