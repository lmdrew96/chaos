import type { LangConfigUI } from "@chaos/lang-config"
import {
  LayoutDashboard,
  BookOpen,
  Cloud,
  Flower2,
  TrendingUp,
  Atom,
  Wrench,
  ScrollText,
  Volume2,
  MessageCircle,
} from "lucide-react"

export const langUI: LangConfigUI = {
  brandName: "ChaosLimbă",
  logoStrokePath: "M 8 3.5 Q 12 7 16 3.5",
  navItems: [
    { name: "Dashboard", href: "/home", icon: LayoutDashboard, description: "Your learning overview" },
    { name: "Chaos Window", href: "/chaos-window", icon: Atom, description: "Speak and write" },
    { name: "Workshop", href: "/workshop", icon: Wrench, description: "Grammar micro-challenges" },
    { name: "Deep Fog", href: "/deep-fog", icon: Cloud, description: "Immersive content" },
    { name: "Error Garden", href: "/error-garden", icon: Flower2, description: "Your error patterns" },
    { name: "Mystery Shelf", href: "/mystery-shelf", icon: BookOpen, description: "Collected unknowns" },
    { name: "Proficiency Tracker", href: "/proficiency-tracker", icon: TrendingUp, description: "Your CEFR progress" },
    { name: "Journey", href: "/journey", icon: ScrollText, description: "Your learning story" },
  ],
  quickTools: [
    { href: "/ce-inseamna", label: "Ce înseamnă?", icon: BookOpen },
    { href: "/cum-se-pronunta", label: "Cum se pronunță?", icon: Volume2 },
    { href: "/ask-tutor", label: "Ask Tutor", icon: MessageCircle },
  ],
}
