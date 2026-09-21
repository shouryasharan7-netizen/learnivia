"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Printer,
  Search,
  CheckCircle,
  HelpCircle,
  Wrench,
  ArrowRight,
  X,
  Calculator,
  Compass,
  FileText,
  Atom,
  Eye,
  EyeOff,
  Copy,
  Check
} from "lucide-react";
import styles from "./page.module.css";

export interface StudyGuide {
  id: string;
  title: string;
  subject: "Mathematics" | "Reading & Writing" | "Science" | "Social Studies";
  level: string;
  gradeCategory: "elementary" | "middle" | "high";
  summary: string;
  keySnippet: string;
  tags: string[];
  toolType?: "fact-family" | "fraction-converter" | "element-lookup" | "peel-builder" | "none";
  content: {
    overview: string;
    coreRules: { title: string; detail: string }[];
    stepByStep?: string[];
    workedExample: {
      problem: string;
      steps: string[];
      result: string;
    };
    commonTraps: string[];
    practiceCheck: {
      question: string;
      answer: string;
      explanation: string;
    };
  };
}

export const STUDY_GUIDES: StudyGuide[] = [
  {
    id: "multiplication-fact-families",
    title: "Multiplication & Division Fact Families",
    subject: "Mathematics",
    level: "Grade 3-5",
    gradeCategory: "elementary",
    summary: "Visual fact triangles, inverse relationships, distributive property, and long division algorithms.",
    keySnippet: "DMSB: Divide, Multiply, Subtract, Bring down • a × b = c ↔ c ÷ a = b",
    tags: ["Number Sense", "Multiplication", "Division", "Algorithms"],
    toolType: "fact-family",
    content: {
      overview: "A fact family is a group of related mathematical equations created using the same three numbers. Multiplication and division are inverse operations: they reverse and check each other.",
      coreRules: [
        {
          title: "Commutative Property",
          detail: "Order does not change the product: a × b = b × a (e.g. 7 × 8 = 8 × 7 = 56). Note: Division is NOT commutative (56 ÷ 8 ≠ 8 ÷ 56)."
        },
        {
          title: "Zero vs Identity Rule",
          detail: "a × 1 = a and a ÷ 1 = a. Any number times 0 equals 0 (a × 0 = 0). Crucial: Division by zero (a ÷ 0) is undefined."
        },
        {
          title: "Long Division Algorithm (DMSB)",
          detail: "Remember 'Dad, Mom, Sister, Brother': 1. Divide, 2. Multiply, 3. Subtract, 4. Bring down the next digit."
        }
      ],
      stepByStep: [
        "Identify your two factors and calculate or find the product (e.g., 6 and 9 multiply to 54).",
        "Write fact 1 (Factor A × Factor B = Product): 6 × 9 = 54",
        "Write fact 2 (Factor B × Factor A = Product): 9 × 6 = 54",
        "Write fact 3 (Product ÷ Factor A = Factor B): 54 ÷ 6 = 9",
        "Write fact 4 (Product ÷ Factor B = Factor A): 54 ÷ 9 = 6"
      ],
      workedExample: {
        problem: "Given factors 8 and 7, construct the complete fact family and check 56 ÷ 7.",
        steps: [
          "Factor 1 = 8, Factor 2 = 7, Product = 8 × 7 = 56",
          "Multiplication 1: 8 × 7 = 56",
          "Multiplication 2: 7 × 8 = 56",
          "Division 1: 56 ÷ 8 = 7",
          "Division 2: 56 ÷ 7 = 8"
        ],
        result: "The four equations are 8×7=56, 7×8=56, 56÷8=7, and 56÷7=8."
      },
      commonTraps: [
        "Confusing 0 ÷ 8 = 0 with 8 ÷ 0 (which is impossible/undefined).",
        "In long division, forgetting to put a 0 in the quotient when a digit cannot be divided."
      ],
      practiceCheck: {
        question: "If 108 ÷ 12 = 9, what are the other three equations that belong to this fact family?",
        answer: "12 × 9 = 108, 9 × 12 = 108, and 108 ÷ 9 = 12.",
        explanation: "Because 12 and 9 are the factors that produce 108, reversing the multiplication and alternating the divisor completes the four equations."
      }
    }
  },
  {
    id: "fractions-decimals-percentages",
    title: "Fractions, Decimals & Percentages",
    subject: "Mathematics",
    level: "Grade 5-8",
    gradeCategory: "middle",
    summary: "Benchmark conversion tables, common denominators, and reciprocal division (Keep-Change-Flip).",
    keySnippet: "KCF: Keep, Change, Flip • 1/2 = 0.5 = 50% • 1/4 = 0.25 = 25% • 3/4 = 0.75 = 75%",
    tags: ["Fractions", "Decimals", "Percentages", "Equivalence"],
    toolType: "fraction-converter",
    content: {
      overview: "Fractions, decimals, and percentages are three distinct notations for describing parts of a whole. Fluency in switching between them is essential for ratio, rate, and algebraic problem solving.",
      coreRules: [
        {
          title: "Benchmark Equivalents",
          detail: "1/2 = 0.5 = 50% • 1/4 = 0.25 = 25% • 3/4 = 0.75 = 75% • 1/5 = 0.2 = 20% • 1/8 = 0.125 = 12.5% • 1/10 = 0.1 = 10% • 1/3 ≈ 0.333 = 33.3%."
        },
        {
          title: "Adding & Subtracting Fractions",
          detail: "You MUST find a common denominator first: a/b + c/d = (ad + bc) / bd. Never add denominators straight across!"
        },
        {
          title: "Dividing Fractions (KCF)",
          detail: "Keep the first fraction, Change division (÷) to multiplication (×), Flip the second fraction into its reciprocal: (a/b) ÷ (c/d) = (a/b) × (d/c)."
        }
      ],
      stepByStep: [
        "Fraction to Decimal: Divide the numerator by denominator (e.g., 3 ÷ 5 = 0.60).",
        "Decimal to Percentage: Multiply by 100 or slide decimal point two places right (0.60 → 60%).",
        "Percentage to Fraction: Place percentage over 100 and simplify (e.g., 60% = 60/100 = 3/5)."
      ],
      workedExample: {
        problem: "Calculate (3/4) ÷ (2/5) and express the result as an improper fraction and mixed number.",
        steps: [
          "Keep the first fraction: 3/4",
          "Change ÷ to ×",
          "Flip 2/5 to 5/2",
          "Multiply straight across: (3 × 5) / (4 × 2) = 15 / 8",
          "Convert to mixed number: 15 ÷ 8 = 1 with remainder 7 → 1 7/8"
        ],
        result: "15/8 or 1 7/8"
      },
      commonTraps: [
        "Adding denominators directly: 1/2 + 1/3 ≠ 2/5! The correct sum is 3/6 + 2/6 = 5/6.",
        "Forgetting to move decimal two places: 0.08 = 8%, NOT 80%."
      ],
      practiceCheck: {
        question: "Convert 7/20 into both a decimal and a percentage.",
        answer: "Decimal: 0.35 | Percentage: 35%",
        explanation: "7 ÷ 20 = 0.35. Multiplying 0.35 by 100 gives 35%. Alternatively, multiply numerator and denominator by 5: 35/100 = 35%."
      }
    }
  },
  {
    id: "algebra-basics-solving-for-x",
    title: "Algebra Basics: Solving for X",
    subject: "Mathematics",
    level: "Grade 7-9",
    gradeCategory: "middle",
    summary: "Systematic multi-step equation solving, balance principle, distributive property, and verification.",
    keySnippet: "Golden Rule: Whatever operation you perform on one side, you must mirror on the other.",
    tags: ["Algebra", "Linear Equations", "Variables", "Inverse Operations"],
    toolType: "none",
    content: {
      overview: "An algebraic equation represents a balanced scale. The goal is to isolate the target variable on one side by applying inverse mathematical operations in reverse order.",
      coreRules: [
        {
          title: "Order of Inverse Operations (SADMEP)",
          detail: "When isolating a variable, work in reverse order of PEMDAS: Subtract/Add first, then Divide/Multiply, then Exponents/Parentheses."
        },
        {
          title: "Distributive Law",
          detail: "Multiply outer terms across all inner terms: a(bx + c) = abx + ac. Watch negative signs closely: -(x - 4) = -x + 4."
        },
        {
          title: "Verification Step",
          detail: "Always substitute your calculated value of x back into the original unsimplified equation to verify both sides evaluate to equality."
        }
      ],
      stepByStep: [
        "Step 1 (Distribute): Expand all parentheses: a(bx + c) = abx + ac.",
        "Step 2 (Combine): Combine like terms separately on the left and right sides.",
        "Step 3 (Collect Variables): Add or subtract variable terms so all x terms reside on one side.",
        "Step 4 (Collect Constants): Add or subtract constants so pure numbers reside on the opposite side.",
        "Step 5 (Isolate): Divide or multiply by the numerical coefficient of x.",
        "Step 6 (Check): Substitute x back into original expression."
      ],
      workedExample: {
        problem: "Solve for x: 4(2x - 3) + 6 = 26",
        steps: [
          "Distribute 4: 8x - 12 + 6 = 26",
          "Combine constants on left: 8x - 6 = 26",
          "Add 6 to both sides: 8x = 32",
          "Divide both sides by 8: x = 4",
          "Check: 4(2(4) - 3) + 6 = 4(8 - 3) + 6 = 4(5) + 6 = 20 + 6 = 26. Equal!"
        ],
        result: "x = 4"
      },
      commonTraps: [
        "Neglecting to distribute negative signs: -(3x - 5) becomes -3x + 5, NOT -3x - 5.",
        "Dividing only one term by coefficient instead of the entire opposite side."
      ],
      practiceCheck: {
        question: "Solve for x: 5x - 2(x + 4) = 13",
        answer: "x = 7",
        explanation: "5x - 2x - 8 = 13 → 3x - 8 = 13 → 3x = 21 → x = 7. Checking: 5(7) - 2(9) = 35 - 18 = 17."
      }
    }
  },
  {
    id: "geometry-essentials",
    title: "Geometry Essentials & Formula Sheet",
    subject: "Mathematics",
    level: "Grade 6-10",
    gradeCategory: "high",
    summary: "Area, perimeter, surface area, cylinder/cone volume, and the Pythagorean Theorem.",
    keySnippet: "Right Triangles: a² + b² = c² • Circle: A = πr², C = 2πr • Cylinder: V = πr²h",
    tags: ["Geometry", "Area", "Perimeter", "Volume", "Pythagoras"],
    toolType: "none",
    content: {
      overview: "Geometry bridges spatial reasoning with algebraic formulas. Use this quick blueprint for 2D plane figures and 3D solid geometry.",
      coreRules: [
        {
          title: "2D Planar Formulas",
          detail: "Rectangle: A = l·w, P = 2(l+w) • Triangle: A = 1/2·b·h • Circle: A = πr², C = 2πr • Trapezoid: A = ((a+b)/2)·h."
        },
        {
          title: "Pythagorean Theorem",
          detail: "In any right-angled triangle: a² + b² = c², where c is the hypotenuse opposite the 90° right angle. Common triples: (3,4,5), (5,12,13), (8,15,17)."
        },
        {
          title: "3D Solid Volumes",
          detail: "Rectangular Prism: V = l·w·h • Cylinder: V = πr²h • Cone: V = 1/3·πr²h • Sphere: V = 4/3·πr³."
        }
      ],
      stepByStep: [
        "Identify given dimensions and verify matching units (convert inches/feet or cm/m first).",
        "Determine whether radius (r) or diameter (d) is given. Remember r = d / 2.",
        "Select the precise formula for area (units²), perimeter (units), or volume (units³).",
        "Substitute numbers and evaluate step-by-step."
      ],
      workedExample: {
        problem: "A cylinder has a radius of 4 cm and a height of 10 cm. Find its volume in terms of π and to 2 decimal places.",
        steps: [
          "Formula: V = π·r²·h",
          "Substitute r = 4 and h = 10: V = π · (4)² · 10",
          "Square radius: 4² = 16",
          "Multiply by height: 16 × 10 = 160",
          "Multiply by π: 160π ≈ 160 × 3.14159 ≈ 502.65 cm³"
        ],
        result: "160π cm³ ≈ 502.65 cm³"
      },
      commonTraps: [
        "Using diameter instead of radius in circular formulas.",
        "Confusing slant height with perpendicular vertical height in triangles and cones."
      ],
      practiceCheck: {
        question: "A right triangle has legs a = 6 cm and b = 8 cm. What is the length of the hypotenuse c?",
        answer: "c = 10 cm",
        explanation: "a² + b² = c² → 6² + 8² = 36 + 64 = 100 → c = √100 = 10 cm."
      }
    }
  },
  {
    id: "reading-comprehension-strategies",
    title: "Reading Comprehension & Critical Analysis",
    subject: "Reading & Writing",
    level: "Grade 3-8",
    gradeCategory: "elementary",
    summary: "Main idea vs topic, context clues (IDEAS), author's purpose (PIE), and inference formulation.",
    keySnippet: "Inference Formula: Text Clues + Prior Schema = Valid Logical Deduction",
    tags: ["Reading", "Comprehension", "Inference", "Context Clues", "Analysis"],
    toolType: "none",
    content: {
      overview: "Active reading requires looking past surface words to decode authorial perspective, tone, and implied thematic significance.",
      coreRules: [
        {
          title: "The Inference Formula",
          detail: "Explicit Text Proof + Reader World Knowledge = Logical Inference. An inference must always be defended by textual evidence."
        },
        {
          title: "Author's Purpose (P.I.E.)",
          detail: "Persuade (convince reader to act or think differently), Inform (teach facts objectively), Entertain (tell an engaging narrative)."
        },
        {
          title: "Context Clues (IDEAS Strategy)",
          detail: "Inference (clues in surrounding sentences), Definition (defined in text), Example (instances given), Antonym (contrasts with 'unlike', 'however'), Synonym (similar words)."
        }
      ],
      stepByStep: [
        "Skim titles, subheadings, and first/last sentences to establish orientation.",
        "Annotate active verbs and contrast keywords (However, Although, Consequently).",
        "Draft a 5-word margin summary for each paragraph.",
        "Distinguish between what the author explicitly stated vs what is implied."
      ],
      workedExample: {
        problem: "Read sentence: 'Elena bundled her heavy wool scarf tighter as freezing gusts whipped the bare birch branches.' What can be inferred about the setting?",
        steps: [
          "Extract clues: wool scarf, freezing gusts, bare birch branches.",
          "Activate schema: Trees shed leaves in late autumn/winter; wool scarves are worn in cold temperatures.",
          "Synthesize: It is wintertime outdoors in a cold climate."
        ],
        result: "Setting: Outdoor winter environment during freezing weather."
      },
      commonTraps: [
        "Selecting an answer that is true in real life but NOT substantiated anywhere in the passage.",
        "Confusing the broad subject topic with the specific thesis or main argument."
      ],
      practiceCheck: {
        question: "What is the key difference between summarizing a text and analyzing a text?",
        answer: "A summary recounts WHAT happened; an analysis unpacks HOW and WHY the author crafted it.",
        explanation: "Summaries restate central events and facts. Analysis evaluates techniques, rhetorical strategies, and deeper thematic intent."
      }
    }
  },
  {
    id: "essay-writing-peel-structure",
    title: "Essay Writing: The PEEL Blueprint",
    subject: "Reading & Writing",
    level: "Grade 5-10",
    gradeCategory: "middle",
    summary: "Introductory thesis statements, body paragraph PEEL scaffold, and synthesis conclusions.",
    keySnippet: "P: Point • E: Evidence • E: Explanation (Analysis) • L: Link back to thesis",
    tags: ["Writing", "Essays", "PEEL", "Thesis", "Argumentation"],
    toolType: "peel-builder",
    content: {
      overview: "The PEEL framework provides a repeatable structure for analytical essays. It guarantees every body paragraph asserts a claim, backs it with proof, and analyzes significance.",
      coreRules: [
        {
          title: "P - Point (Topic Sentence)",
          detail: "Directly state the claim or argument of this paragraph. Must connect directly to one facet of your overarching thesis."
        },
        {
          title: "E - Evidence (Cited Proof)",
          detail: "Provide specific textual evidence, historical data, or quoted lines. Always introduce the speaker or source context."
        },
        {
          title: "E - Explanation (The Analytical Engine)",
          detail: "Explain HOW and WHY this evidence proves your point. Dedicate at least 2-3 sentences of original analytical thought per quote."
        },
        {
          title: "L - Link (Thesis Bridge)",
          detail: "Summarize the significance and connect back to the primary essay thesis while setting up a transition to the next topic."
        }
      ],
      stepByStep: [
        "Formulate a defensible 3-part thesis statement in your introduction.",
        "Assign one major supporting pillar of your thesis to each body paragraph.",
        "Write your Point sentence.",
        "Integrate your contextualized Evidence.",
        "Write your Explanation (analyze word choice, implications, cause-and-effect).",
        "Conclude with your Link sentence."
      ],
      workedExample: {
        problem: "Exemplary PEEL paragraph analyzing Lord of the Flies conch shell.",
        steps: [
          "Point: In Lord of the Flies, Golding uses the conch shell as an emblem of fragile democratic civilization.",
          "Evidence: When assembly begins, Ralph decrees that whoever holds the conch possesses 'the right to speak' without interruption (Golding 33).",
          "Explanation: By granting democratic authority to an inanimate natural object, the boys attempt to replicate adult parliamentary systems. However, because the conch holds only symbolic rather than physical enforcement power, it highlights how democratic order relies solely on collective consent.",
          "Link: Consequently, the destruction of the conch in the climax signals the irreversible collapse of civil rule on the island."
        ],
        result: "Complete, cohesive analytical paragraph with zero plot summary fluff."
      },
      commonTraps: [
        "'Quote dropping' without introducing the speaker or analyzing the wording.",
        "Simply restating the plot instead of interpreting the thematic significance."
      ],
      practiceCheck: {
        question: "Why is the 'Explanation' component usually the longest part of a PEEL paragraph?",
        answer: "Because evidence cannot speak for itself; your original analysis proves why the quote matters.",
        explanation: "Without explanation, an essay is just a collection of quotes. The explanation provides your critical thinking and argument."
      }
    }
  },
  {
    id: "earth-science-rocks-water-weather",
    title: "Earth Science: Rocks, Water & Weather",
    subject: "Science",
    level: "Grade 4-6",
    gradeCategory: "elementary",
    summary: "The rock cycle triad, hydrologic cycle phases, atmospheric layers, and weather front mechanics.",
    keySnippet: "Igneous (Melted) ↔ Sedimentary (Compacted) ↔ Metamorphic (Heated & Pressured)",
    tags: ["Earth Science", "Rock Cycle", "Water Cycle", "Weather", "Atmosphere"],
    toolType: "none",
    content: {
      overview: "Earth is a dynamic closed system driven by geothermal heat from within and solar radiation from above. Matter continuously recycles through the geosphere, hydrosphere, and atmosphere.",
      coreRules: [
        {
          title: "The Three Rock Families",
          detail: "Igneous (cooled magma/lava like Granite, Basalt) • Sedimentary (compacted sediments with fossils like Sandstone, Limestone) • Metamorphic (heat & pressure altered like Marble, Slate)."
        },
        {
          title: "The Water Cycle (Hydrologic Cycle)",
          detail: "Evaporation (liquid to gas) + Transpiration (plant vapor) → Condensation (gas to cloud droplets) → Precipitation (rain/snow/sleet) → Collection/Runoff."
        },
        {
          title: "Weather Fronts",
          detail: "Cold Fronts (dense cold air forces warm air up rapidly, creating thunderstorms) vs Warm Fronts (warm air slides gradually over cold air, bringing prolonged steady rain)."
        }
      ],
      stepByStep: [
        "Rock Cycle: Any rock can turn into any other rock through melting, weathering, or heat/pressure.",
        "Cloud Identification: Cirrus (high, wispy, ice crystals), Cumulus (puffy, fair weather), Stratus (flat gray blanket), Cumulonimbus (towering thunderstorm anvil)."
      ],
      workedExample: {
        problem: "Trace how a volcanic granite rock can eventually become a metamorphic gneiss.",
        steps: [
          "Step 1: Granite (igneous) forms from magma cooling underground.",
          "Step 2: Uplift exposes it to weathering into sand sediments.",
          "Step 3: Sediments compress into sandstone (sedimentary).",
          "Step 4: Tectonic plate collision buries the sandstone under intense heat and pressure.",
          "Step 5: Minerals recrystallize into banded Gneiss (metamorphic)."
        ],
        result: "Igneous → Sedimentary → Metamorphic progression through geological processes."
      },
      commonTraps: [
        "Assuming rocks are permanent and unchangeable.",
        "Thinking rain falls from evaporation; condensation must happen first to form clouds."
      ],
      practiceCheck: {
        question: "In which category of rock are fossils exclusively preserved, and why?",
        answer: "Sedimentary rock.",
        explanation: "The extreme heat involved in creating igneous and metamorphic rocks melts or destroys organic remains."
      }
    }
  },
  {
    id: "life-science-cells-ecosystems",
    title: "Life Science: Cells & Living Systems",
    subject: "Science",
    level: "Grade 6-8",
    gradeCategory: "middle",
    summary: "Cellular organelles, plant vs animal cells, photosynthesis equations, and trophic energy webs.",
    keySnippet: "Plant Only: Cell Wall, Chloroplast, Large Vacuole • Both: Nucleus, Mitochondria, Membrane",
    tags: ["Biology", "Cells", "Photosynthesis", "Respiration", "Ecosystems"],
    toolType: "none",
    content: {
      overview: "All living organisms are composed of cellular building blocks. Energy flows through biological systems via the reciprocal relationship between photosynthesis and cellular respiration.",
      coreRules: [
        {
          title: "Cell Organelle Functions",
          detail: "Nucleus (DNA control center) • Mitochondria (cellular respiration & ATP power) • Ribosomes (protein synthesis) • Cell Membrane (selective permeability boundary)."
        },
        {
          title: "Plant vs Animal Cell Key Differences",
          detail: "Plant Cells: possess rigid cellulose Cell Wall, Chloroplasts for light capture, and a Large Central Vacuole. Animal Cells: lack cell wall and chloroplasts; have small vacuoles."
        },
        {
          title: "Photosynthesis vs Respiration",
          detail: "Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP energy."
        }
      ],
      stepByStep: [
        "Light energy is harvested by chlorophyll inside chloroplasts.",
        "Carbon dioxide and water are combined to produce glucose and oxygen.",
        "Organisms ingest glucose and breathe oxygen.",
        "Mitochondria combust glucose to release ATP, expelling CO₂ and water."
      ],
      workedExample: {
        problem: "In an ecosystem food web, a plant captures 10,000 Joules of solar energy. How much energy reaches the secondary consumer?",
        steps: [
          "Producer level (plants): 10,000 J",
          "Primary consumer level (herbivore): 10% of 10,000 J = 1,000 J",
          "Secondary consumer level (carnivore): 10% of 1,000 J = 100 J"
        ],
        result: "100 Joules reaches the secondary consumer (90% lost as heat at each trophic transfer)."
      },
      commonTraps: [
        "Thinking plant cells only do photosynthesis and don't have mitochondria. (Plants need mitochondria to metabolize their stored sugars!).",
        "Confusing respiration (cellular metabolic process) with breathing (mechanical ventilation)."
      ],
      practiceCheck: {
        question: "What would happen to cellular energy production if an animal cell's mitochondria were damaged?",
        answer: "ATP energy production would drop drastically, starving the cell of metabolic power.",
        explanation: "Mitochondria produce over 90% of cellular ATP through aerobic respiration."
      }
    }
  },
  {
    id: "chemistry-basics-atoms-elements",
    title: "Chemistry: Atoms & The Periodic Table",
    subject: "Science",
    level: "Grade 8-10",
    gradeCategory: "high",
    summary: "Subatomic particle charges, atomic vs mass number, electron shell octets, and bonding types.",
    keySnippet: "Atomic # = Protons • Mass # = Protons + Neutrons • Octet Rule = 8 Valence Electrons",
    tags: ["Chemistry", "Atoms", "Periodic Table", "Chemical Bonding"],
    toolType: "element-lookup",
    content: {
      overview: "Atoms are the fundamental building blocks of all chemical matter. Periodic trends predict an element's electron configuration, bonding behavior, and reactivity.",
      coreRules: [
        {
          title: "Subatomic Particle Charges",
          detail: "Protons: +1 charge, mass 1 amu (in nucleus; defines element Z) • Neutrons: 0 neutral charge, mass 1 amu (in nucleus) • Electrons: -1 charge, negligible mass (in orbitals)."
        },
        {
          title: "Reading Periodic Tiles",
          detail: "Atomic Number = number of protons = number of electrons in neutral atom. Mass Number = Protons + Neutrons. Neutrons = Mass Number - Atomic Number."
        },
        {
          title: "Ionic vs Covalent Bonding",
          detail: "Ionic: Transfer of electrons between a metal and a nonmetal (e.g., Na⁺ + Cl⁻ → NaCl). Covalent: Sharing of electron pairs between nonmetals (e.g., H₂O, CO₂)."
        }
      ],
      stepByStep: [
        "Find atomic number (Z) to determine number of protons.",
        "Check overall charge: if neutral, electrons equal protons.",
        "Round atomic weight to nearest whole number to get mass number.",
        "Subtract atomic number from mass number to find neutron count.",
        "Fill electron energy levels (Shell 1: up to 2, Shell 2: up to 8, Shell 3: up to 8)."
      ],
      workedExample: {
        problem: "Analyze Sodium-23 (Na, Atomic Number 11). Determine its protons, neutrons, electrons, and valence electrons.",
        steps: [
          "Atomic number = 11 → Protons = 11",
          "Neutral atom → Electrons = 11",
          "Mass number = 23 → Neutrons = 23 - 11 = 12",
          "Electron configuration: 2 in shell 1, 8 in shell 2, 1 in shell 3",
          "Valence electrons = 1 (Group 1 alkali metal)"
        ],
        result: "11 Protons, 12 Neutrons, 11 Electrons, 1 Valence Electron (tends to form Na⁺ ion)."
      },
      commonTraps: [
        "Confusing atomic mass (weighted average decimal) with mass number (whole number sum of protons + neutrons).",
        "Mixing up periods (horizontal rows = energy shells) with groups (vertical columns = valence electrons)."
      ],
      practiceCheck: {
        question: "How many protons, neutrons, and electrons are in a neutral Carbon-14 isotope atom? (Carbon atomic # = 6).",
        answer: "Protons = 6, Neutrons = 8, Electrons = 6.",
        explanation: "Atomic number 6 means 6 protons and 6 electrons. Mass number 14 minus 6 protons gives 8 neutrons."
      }
    }
  },
  {
    id: "physics-mechanics-kinematics",
    title: "Physics: Kinematics & Newton's Laws",
    subject: "Science",
    level: "Grade 8-10",
    gradeCategory: "high",
    summary: "Constant acceleration kinematics equations, Newton's 3 laws of motion, and work-energy theorem.",
    keySnippet: "v = v₀ + at • Δx = v₀t + 1/2at² • v² = v₀² + 2aΔx • F_net = ma • W = Fd",
    tags: ["Physics", "Kinematics", "Newton's Laws", "Forces", "Energy"],
    toolType: "none",
    content: {
      overview: "Classical mechanics describes how forces govern the motion of objects in space. Master the three kinematics formulas and Newton's laws to solve any 1D or 2D trajectory.",
      coreRules: [
        {
          title: "The 3 Big Kinematics Equations",
          detail: "1. v = v₀ + at (no Δx) • 2. Δx = v₀t + 1/2at² (no v) • 3. v² = v₀² + 2aΔx (no t)."
        },
        {
          title: "Newton's Three Laws",
          detail: "1st Law (Inertia): Objects preserve velocity unless acted on by net force. 2nd Law: F_net = m·a. 3rd Law: Forces occur in equal and opposite pairs on different objects (F_A on B = -F_B on A)."
        },
        {
          title: "Work & Kinetic Energy",
          detail: "Work = F · d · cos(θ) (Joules). Kinetic Energy KE = 1/2 m v². Gravitational Potential Energy PE = m·g·h (g ≈ 9.8 m/s²)."
        }
      ],
      stepByStep: [
        "List your five kinematic variables: v₀ (initial velocity), v (final velocity), a (acceleration), t (time), Δx (displacement).",
        "Identify which three values are known and which one is requested.",
        "Choose the unique kinematics equation that excludes the remaining unknown variable.",
        "Substitute with proper signs (+ for forward/up, - for backward/down) and solve."
      ],
      workedExample: {
        problem: "A skateboarder starts from rest (v₀ = 0) and accelerates uniformly down a ramp at 2.5 m/s² for 4 seconds. How far did they travel?",
        steps: [
          "Knowns: v₀ = 0 m/s, a = 2.5 m/s², t = 4 s. Unknown: Δx.",
          "Formula without final velocity v: Δx = v₀t + 1/2at²",
          "Substitute: Δx = (0)(4) + 1/2(2.5)(4²)",
          "Calculate: Δx = 0 + 1.25 × 16 = 20 meters"
        ],
        result: "The skateboarder traveled 20 meters down the ramp."
      },
      commonTraps: [
        "Forgetting to square time t in 1/2at².",
        "Using 9.8 m/s² with the wrong sign when an object is thrown upward (+v, but -g)."
      ],
      practiceCheck: {
        question: "A 5 kg crate is pushed with a net force of 35 N. What is its acceleration?",
        answer: "a = 7 m/s²",
        explanation: "F = m · a → a = F / m = 35 N / 5 kg = 7 m/s²."
      }
    }
  },
  {
    id: "social-studies-map-skills",
    title: "Social Studies: Map Skills & Geography",
    subject: "Social Studies",
    level: "Grade 3-6",
    gradeCategory: "elementary",
    summary: "Latitude vs longitude, prime meridian, map legends, compass rose, and hemisphere divisions.",
    keySnippet: "Latitude = Flatitude (Equator 0°) • Longitude = Long vertical lines (Prime Meridian 0°)",
    tags: ["Geography", "Maps", "Latitude", "Longitude", "Hemispheres"],
    toolType: "none",
    content: {
      overview: "Geography provides spatial orientation to human history. Understanding coordinate systems, scales, and cartographic projections allows students to interpret historical trade, settlement, and climate patterns.",
      coreRules: [
        {
          title: "Latitude vs Longitude",
          detail: "Latitude: Horizontal lines measuring North/South of the Equator (0°). Remember 'Flatitude'. Longitude: Vertical meridians measuring East/West of the Prime Meridian (0°)."
        },
        {
          title: "Coordinates Format",
          detail: "Always written as (Latitude, Longitude), e.g., (40° N, 74° W for New York City). Latitude always comes first alphabetically."
        },
        {
          title: "Map Essentials (DOGSTAILS)",
          detail: "Date, Orientation (Compass rose), Grid, Scale (distance ratio), Title, Author, Index, Legend (symbol key), Situation."
        }
      ],
      stepByStep: [
        "Locate the Equator (0° latitude) to determine Northern or Southern hemisphere.",
        "Locate Prime Meridian (0° longitude) to determine Eastern or Western hemisphere.",
        "Read the Map Key/Legend to translate color tints and icons into real features.",
        "Use the bar scale with a ruler or scrap paper to calculate physical ground mileage."
      ],
      workedExample: {
        problem: "If a map scale indicates 1 inch = 75 miles, what is the actual ground distance between two cities 4 inches apart on the map?",
        steps: [
          "Scale ratio: 1 inch = 75 miles",
          "Measured distance: 4 inches",
          "Calculation: 4 × 75 = 300 miles"
        ],
        result: "The two cities are 300 ground miles apart."
      },
      commonTraps: [
        "Reversing coordinates by placing longitude before latitude.",
        "Confusing intermediate directions (NE, NW, SE, SW) with cardinal directions (N, S, E, W)."
      ],
      practiceCheck: {
        question: "Which hemisphere contains both the entire continent of North America and South America?",
        answer: "The Western Hemisphere.",
        explanation: "Both American continents sit west of the Prime Meridian (0° longitude) in the Western Hemisphere."
      }
    }
  }
];

export default function StudyGuidesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [activeGuideModal, setActiveGuideModal] = useState<StudyGuide | null>(null);
  const [showPracticeAnswer, setShowPracticeAnswer] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Interactive Mini-Tool States
  // Fact Family Tool
  const [ffFactorA, setFfFactorA] = useState<number>(7);
  const [ffFactorB, setFfFactorB] = useState<number>(8);

  // Fraction Converter Tool
  const [fcNum, setFcNum] = useState<number>(3);
  const [fcDenom, setFcDenom] = useState<number>(8);

  // Element Search Tool
  const [elementQuery, setElementQuery] = useState<string>("Carbon");

  // PEEL Builder Tool
  const [peelP, setPeelP] = useState<string>("");
  const [peelEv, setPeelEv] = useState<string>("");
  const [peelEx, setPeelEx] = useState<string>("");
  const [peelL, setPeelL] = useState<string>("");

  const subjects = ["All", "Mathematics", "Science", "Reading & Writing", "Social Studies"];
  const gradeFilters = [
    { id: "All", label: "All Grades" },
    { id: "elementary", label: "Grades 3-5" },
    { id: "middle", label: "Grades 6-8" },
    { id: "high", label: "Grades 9-10" },
  ];

  const filteredGuides = useMemo(() => {
    return STUDY_GUIDES.filter((guide) => {
      const matchesSubject = selectedSubject === "All" || guide.subject === selectedSubject;
      const matchesGrade = selectedGrade === "All" || guide.gradeCategory === selectedGrade;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.summary.toLowerCase().includes(q) ||
        guide.keySnippet.toLowerCase().includes(q) ||
        guide.tags.some((t) => t.toLowerCase().includes(q));
      return matchesSubject && matchesGrade && matchesSearch;
    });
  }, [searchQuery, selectedSubject, selectedGrade]);

  function handleOpenGuide(guide: StudyGuide) {
    setActiveGuideModal(guide);
    setShowPracticeAnswer(false);
  }

  function handlePrintSheet() {
    window.print();
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedNotification(label);
    setTimeout(() => setCopiedNotification(null), 2500);
  }

  // Periodic elements quick lookup table
  const ELEMENT_DATABASE = [
    { num: 1, sym: "H", name: "Hydrogen", mass: 1.008, group: "Nonmetal", val: 1 },
    { num: 2, sym: "He", name: "Helium", mass: 4.003, group: "Noble Gas", val: 2 },
    { num: 6, sym: "C", name: "Carbon", mass: 12.011, group: "Nonmetal", val: 4 },
    { num: 7, sym: "N", name: "Nitrogen", mass: 14.007, group: "Nonmetal", val: 5 },
    { num: 8, sym: "O", name: "Oxygen", mass: 15.999, group: "Nonmetal", val: 6 },
    { num: 11, sym: "Na", name: "Sodium", mass: 22.990, group: "Alkali Metal", val: 1 },
    { num: 12, sym: "Mg", name: "Magnesium", mass: 24.305, group: "Alkaline Earth", val: 2 },
    { num: 13, sym: "Al", name: "Aluminum", mass: 26.982, group: "Post-Transition Metal", val: 3 },
    { num: 17, sym: "Cl", name: "Chlorine", mass: 35.45, group: "Halogen", val: 7 },
    { num: 20, sym: "Ca", name: "Calcium", mass: 40.078, group: "Alkaline Earth", val: 2 },
    { num: 26, sym: "Fe", name: "Iron", mass: 55.845, group: "Transition Metal", val: 2 },
    { num: 29, sym: "Cu", name: "Copper", mass: 63.546, group: "Transition Metal", val: 2 },
    { num: 79, sym: "Au", name: "Gold", mass: 196.97, group: "Transition Metal", val: 1 }
  ];

  const matchedElement = ELEMENT_DATABASE.find(
    (el) =>
      el.name.toLowerCase().includes(elementQuery.toLowerCase()) ||
      el.sym.toLowerCase() === elementQuery.toLowerCase() ||
      String(el.num) === elementQuery.trim()
  ) || ELEMENT_DATABASE[2]; // fallback to Carbon

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/resources">Resources</Link>
          <span>/</span>
          <span>Study Guides &amp; Tools</span>
        </div>

        {/* Hero Header */}
        <div className={styles.heroSection}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroBadge}>Free Academic Toolkit</span>
            <span className={styles.heroSubBadge}>K-10 Standards Aligned</span>
          </div>
          <h1 className={styles.title}>K-10 Study Guides &amp; Subject Summaries</h1>
          <p className={styles.subtitle}>
            Comprehensive printable study guides, formula blueprints, step-by-step concept breakdowns, and interactive self-checks across Mathematics, Science, English Language Arts, and Social Studies.
          </p>
        </div>

        {/* Quick Access to In-Session Learning Tools */}
        <div className={styles.toolsBanner}>
          <div className={styles.toolsBannerLeft}>
            <div className={styles.toolsBannerIcon}>
              <Wrench size={20} />
            </div>
            <div>
              <h3 className={styles.toolsBannerHeading}>Looking for live session utilities?</h3>
              <p className={styles.toolsBannerText}>
                Use the Focus Timer, Icebreaker Reflection Prompts, and live Session Scratchpad.
              </p>
            </div>
          </div>
          <Link href="/resources/tools" className={styles.toolsBannerBtn}>
            <span>Open Session Tools</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search concepts (e.g. Algebra, PEEL, Fractions, Rocks, Atoms)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={styles.clearSearchBtn} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Subject Pills */}
          <div className={styles.subjectTabs}>
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`${styles.subjectTab} ${selectedSubject === sub ? styles.subjectTabActive : ""}`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Grade Pills */}
          <div className={styles.gradeFilterRow}>
            <span className={styles.gradeFilterLabel}>Grade Level:</span>
            {gradeFilters.map((gf) => (
              <button
                key={gf.id}
                onClick={() => setSelectedGrade(gf.id)}
                className={`${styles.gradeBtn} ${selectedGrade === gf.id ? styles.gradeBtnActive : ""}`}
              >
                {gf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Count */}
        <div className={styles.resultsCountBar}>
          <span>Showing {filteredGuides.length} academic reference guides</span>
        </div>

        {/* Study Guides Grid */}
        <div className={styles.cardsGrid}>
          {filteredGuides.map((guide) => (
            <div key={guide.id} className={styles.guideCard}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>{guide.level}</span>
                <span className={styles.subjectTag}>{guide.subject}</span>
              </div>

              <h2 className={styles.guideTitle}>{guide.title}</h2>
              <p className={styles.guideDesc}>{guide.summary}</p>

              {/* Highlight Formula / Rule Box */}
              <div className={styles.keySnippetBox}>
                <span className={styles.keySnippetLabel}>Core Rule / Formula:</span>
                <code className={styles.keySnippetCode}>{guide.keySnippet}</code>
              </div>

              {/* Tags */}
              <div className={styles.tagsRow}>
                {guide.tags.map((t) => (
                  <span key={t} className={styles.tagPill}>{t}</span>
                ))}
              </div>

              {/* Real Educational Actions: Read & Print (No ad redirects) */}
              <div className={styles.cardActionsRow}>
                <button
                  onClick={() => handleOpenGuide(guide)}
                  className={styles.primaryGuideBtn}
                >
                  <BookOpen size={15} />
                  <span>Read Full Guide</span>
                </button>
                <button
                  onClick={() => handleOpenGuide(guide)}
                  className={styles.secondaryGuideBtn}
                  title="Open print-friendly reference cheat sheet"
                >
                  <Printer size={15} />
                  <span>Cheat Sheet</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className={styles.emptyState}>
            <BookOpen size={36} color="var(--wa-muted, #64748B)" />
            <h3 className={styles.emptyTitle}>No study guides found</h3>
            <p className={styles.emptyDesc}>Try clearing your search query or switching subject filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("All");
                setSelectedGrade("All");
              }}
              className={styles.resetFiltersBtn}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Comprehensive Study Guide Modal & Cheat Sheet Viewer */}
      {activeGuideModal && (
        <div className={styles.modalBackdrop} onClick={() => setActiveGuideModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalMetaRow}>
                  <span className={styles.badge}>{activeGuideModal.level}</span>
                  <span className={styles.subjectTag}>{activeGuideModal.subject}</span>
                </div>
                <h2 className={styles.modalTitle}>{activeGuideModal.title}</h2>
              </div>
              <div className={styles.modalHeaderActions}>
                <button onClick={handlePrintSheet} className={styles.modalPrintBtn}>
                  <Printer size={15} />
                  <span>Print Sheet</span>
                </button>
                <button
                  onClick={() => setActiveGuideModal(null)}
                  className={styles.modalCloseBtn}
                  aria-label="Close guide viewer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body with Rich Educational Content */}
            <div className={styles.modalBody}>
              {/* Notification Toast */}
              {copiedNotification && (
                <div className={styles.copyToast}>
                  <Check size={14} />
                  <span>Copied {copiedNotification} to clipboard!</span>
                </div>
              )}

              {/* 1. Overview */}
              <section className={styles.guideSection}>
                <h3 className={styles.sectionHeading}>
                  <BookOpen size={16} /> Concept Overview
                </h3>
                <p className={styles.sectionParagraph}>{activeGuideModal.content.overview}</p>
              </section>

              {/* 2. Core Rules and Formulas */}
              <section className={styles.guideSection}>
                <h3 className={styles.sectionHeading}>
                  <CheckCircle size={16} /> Key Rules &amp; Formulas
                </h3>
                <div className={styles.rulesGrid}>
                  {activeGuideModal.content.coreRules.map((rule) => (
                    <div key={rule.title} className={styles.ruleCard}>
                      <h4 className={styles.ruleTitle}>{rule.title}</h4>
                      <p className={styles.ruleDetail}>{rule.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Interactive Mini-Tools (Topic-Specific) */}
              {activeGuideModal.toolType === "fact-family" && (
                <section className={styles.interactiveToolSection}>
                  <h3 className={styles.sectionHeading}>
                    <Calculator size={16} /> Interactive Fact Family Triangle Generator
                  </h3>
                  <p className={styles.toolSubtext}>Enter two factors to generate the complete four-equation fact family.</p>
                  <div className={styles.calcInputsRow}>
                    <div>
                      <label className={styles.calcLabel}>Factor A:</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={ffFactorA}
                        onChange={(e) => setFfFactorA(Math.max(1, parseInt(e.target.value) || 1))}
                        className={styles.calcInput}
                      />
                    </div>
                    <div>
                      <label className={styles.calcLabel}>Factor B:</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={ffFactorB}
                        onChange={(e) => setFfFactorB(Math.max(1, parseInt(e.target.value) || 1))}
                        className={styles.calcInput}
                      />
                    </div>
                  </div>
                  <div className={styles.calcResultsBox}>
                    <div className={styles.factTriangleHeader}>
                      Product: <strong>{ffFactorA * ffFactorB}</strong> (from {ffFactorA} and {ffFactorB})
                    </div>
                    <div className={styles.factFamilyEquations}>
                      <div className={styles.factEquation}>1. {ffFactorA} × {ffFactorB} = {ffFactorA * ffFactorB}</div>
                      <div className={styles.factEquation}>2. {ffFactorB} × {ffFactorA} = {ffFactorA * ffFactorB}</div>
                      <div className={styles.factEquation}>3. {ffFactorA * ffFactorB} ÷ {ffFactorA} = {ffFactorB}</div>
                      <div className={styles.factEquation}>4. {ffFactorA * ffFactorB} ÷ {ffFactorB} = {ffFactorA}</div>
                    </div>
                  </div>
                </section>
              )}

              {activeGuideModal.toolType === "fraction-converter" && (
                <section className={styles.interactiveToolSection}>
                  <h3 className={styles.sectionHeading}>
                    <Calculator size={16} /> Live Fraction ↔ Decimal ↔ Percentage Converter
                  </h3>
                  <div className={styles.calcInputsRow}>
                    <div>
                      <label className={styles.calcLabel}>Numerator:</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={fcNum}
                        onChange={(e) => setFcNum(Math.max(1, parseInt(e.target.value) || 1))}
                        className={styles.calcInput}
                      />
                    </div>
                    <div>
                      <label className={styles.calcLabel}>Denominator:</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={fcDenom}
                        onChange={(e) => setFcDenom(Math.max(1, parseInt(e.target.value) || 1))}
                        className={styles.calcInput}
                      />
                    </div>
                  </div>
                  <div className={styles.calcResultsGrid}>
                    <div className={styles.calcResultCard}>
                      <span className={styles.calcResultLabel}>Fraction</span>
                      <span className={styles.calcResultValue}>{fcNum} / {fcDenom}</span>
                    </div>
                    <div className={styles.calcResultCard}>
                      <span className={styles.calcResultLabel}>Decimal</span>
                      <span className={styles.calcResultValue}>{(fcNum / fcDenom).toFixed(4)}</span>
                    </div>
                    <div className={styles.calcResultCard}>
                      <span className={styles.calcResultLabel}>Percentage</span>
                      <span className={styles.calcResultValue}>{((fcNum / fcDenom) * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </section>
              )}

              {activeGuideModal.toolType === "element-lookup" && (
                <section className={styles.interactiveToolSection}>
                  <h3 className={styles.sectionHeading}>
                    <Atom size={16} /> Quick Element &amp; Atomic Property Lookup
                  </h3>
                  <div className={styles.elementSearchRow}>
                    <input
                      type="text"
                      placeholder="Type element symbol or name (e.g. C, Na, Oxygen, Gold, 26)..."
                      value={elementQuery}
                      onChange={(e) => setElementQuery(e.target.value)}
                      className={styles.elementInput}
                    />
                  </div>
                  <div className={styles.elementCard}>
                    <div className={styles.elementTile}>
                      <span className={styles.elementNum}>{matchedElement.num}</span>
                      <span className={styles.elementSym}>{matchedElement.sym}</span>
                      <span className={styles.elementName}>{matchedElement.name}</span>
                      <span className={styles.elementMass}>{matchedElement.mass}</span>
                    </div>
                    <div className={styles.elementDetails}>
                      <div className={styles.elementDetailRow}>
                        <span>Protons:</span> <strong>{matchedElement.num}</strong>
                      </div>
                      <div className={styles.elementDetailRow}>
                        <span>Neutrons:</span> <strong>{Math.round(matchedElement.mass) - matchedElement.num}</strong>
                      </div>
                      <div className={styles.elementDetailRow}>
                        <span>Electrons:</span> <strong>{matchedElement.num}</strong>
                      </div>
                      <div className={styles.elementDetailRow}>
                        <span>Valence Electrons:</span> <strong>{matchedElement.val}</strong>
                      </div>
                      <div className={styles.elementDetailRow}>
                        <span>Classification:</span> <strong>{matchedElement.group}</strong>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeGuideModal.toolType === "peel-builder" && (
                <section className={styles.interactiveToolSection}>
                  <h3 className={styles.sectionHeading}>
                    <FileText size={16} /> Interactive PEEL Paragraph Builder
                  </h3>
                  <p className={styles.toolSubtext}>Draft each layer of your argument and combine into an analytical paragraph.</p>
                  <div className={styles.peelInputs}>
                    <div>
                      <label className={styles.calcLabel}><strong>P</strong>oint (Topic Claim):</label>
                      <input
                        type="text"
                        placeholder="In Romeo and Juliet, Shakespeare presents fate as an inescapable force..."
                        value={peelP}
                        onChange={(e) => setPeelP(e.target.value)}
                        className={styles.calcInput}
                      />
                    </div>
                    <div>
                      <label className={styles.calcLabel}><strong>E</strong>vidence (Quoted Text with Context):</label>
                      <input
                        type="text"
                        placeholder="In the Prologue, the chorus describes the lovers as 'star-crossed'..."
                        value={peelEv}
                        onChange={(e) => setPeelEv(e.target.value)}
                        className={styles.calcInput}
                      />
                    </div>
                    <div>
                      <label className={styles.calcLabel}><strong>E</strong>xplanation (Word analysis and meaning):</label>
                      <textarea
                        rows={2}
                        placeholder="The astrological diction implies celestial bodies dictate human destiny..."
                        value={peelEx}
                        onChange={(e) => setPeelEx(e.target.value)}
                        className={styles.calcInput}
                      />
                    </div>
                    <div>
                      <label className={styles.calcLabel}><strong>L</strong>ink (Bridge back to thesis):</label>
                      <input
                        type="text"
                        placeholder="Thus, their tragic demise is framed not as coincidence, but as predetermined catastrophe."
                        value={peelL}
                        onChange={(e) => setPeelL(e.target.value)}
                        className={styles.calcInput}
                      />
                    </div>
                  </div>
                  {(peelP || peelEv || peelEx || peelL) && (
                    <div className={styles.peelOutputBox}>
                      <div className={styles.peelOutputHeader}>
                        <span>Combined Paragraph Draft:</span>
                        <button
                          onClick={() => copyToClipboard(`${peelP} ${peelEv} ${peelEx} ${peelL}`, "Paragraph")}
                          className={styles.copyBtn}
                        >
                          <Copy size={13} /> Copy Draft
                        </button>
                      </div>
                      <p className={styles.peelOutputText}>
                        {peelP} {peelEv} {peelEx} {peelL}
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* 4. Worked Step-by-Step Example */}
              <section className={styles.guideSection}>
                <h3 className={styles.sectionHeading}>
                  <Compass size={16} /> Worked Step-by-Step Example
                </h3>
                <div className={styles.workedExampleBox}>
                  <div className={styles.workedExampleProblem}>
                    <strong>Problem:</strong> {activeGuideModal.content.workedExample.problem}
                  </div>
                  <div className={styles.workedStepsList}>
                    {activeGuideModal.content.workedExample.steps.map((step, idx) => (
                      <div key={idx} className={styles.workedStepItem}>
                        <span className={styles.stepNum}>{idx + 1}</span>
                        <span className={styles.stepText}>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.workedResultRow}>
                    <CheckCircle size={15} color="var(--wa-green, #2563EB)" />
                    <span><strong>Solution:</strong> {activeGuideModal.content.workedExample.result}</span>
                  </div>
                </div>
              </section>

              {/* 5. Common Traps */}
              <section className={styles.guideSection}>
                <h3 className={styles.sectionHeading}>
                  <HelpCircle size={16} /> Common Pitfalls to Avoid
                </h3>
                <ul className={styles.trapsList}>
                  {activeGuideModal.content.commonTraps.map((trap, idx) => (
                    <li key={idx} className={styles.trapItem}>{trap}</li>
                  ))}
                </ul>
              </section>

              {/* 6. Interactive Self-Test Practice Check */}
              <section className={styles.practiceSection}>
                <div className={styles.practiceHeader}>
                  <h3 className={styles.practiceTitle}>
                    <HelpCircle size={16} /> Quick Practice Check
                  </h3>
                  <button
                    onClick={() => setShowPracticeAnswer(!showPracticeAnswer)}
                    className={styles.revealBtn}
                  >
                    {showPracticeAnswer ? <><EyeOff size={14} /> Hide Answer</> : <><Eye size={14} /> Check Answer</>}
                  </button>
                </div>
                <p className={styles.practiceQuestion}>{activeGuideModal.content.practiceCheck.question}</p>
                {showPracticeAnswer && (
                  <div className={styles.practiceSolutionBox}>
                    <div className={styles.solutionAnswer}>
                      <strong>Answer:</strong> {activeGuideModal.content.practiceCheck.answer}
                    </div>
                    <p className={styles.solutionExplanation}>
                      {activeGuideModal.content.practiceCheck.explanation}
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
