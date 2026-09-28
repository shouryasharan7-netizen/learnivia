import type { Metadata } from "next";
import ObservatoryClient from "./ObservatoryClient";

export const metadata: Metadata = {
  title: "Academic Observatory Prototype | Learnivia",
  description:
    "Interactive Knowledge Reactor, tactile curriculum scrubber, and 3D verified credential specimen cards.",
};

export default function ObservatoryPage() {
  return <ObservatoryClient />;
}
