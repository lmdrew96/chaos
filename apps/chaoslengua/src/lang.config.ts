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
  Mic2,
  Volume2,
  MessageCircle,
} from "lucide-react"

export const langUI: LangConfigUI = {
  brandName: "ChaosLengua",
  logoStrokePath: "M 8 4.25 Q 10 2.5 12 4.25 T 16 4.25",
  navItems: [
    { name: "Dashboard", href: "/home", icon: LayoutDashboard, description: "Your learning overview" },
    { name: "Chaos Window", href: "/chaos-window", icon: Atom, description: "Speak and write" },
    { name: "Workshop", href: "/workshop", icon: Wrench, description: "Grammar micro-challenges" },
    { name: "Pronunciación", href: "/pronunciation-practice", icon: Mic2, description: "Pares mínimos de acento" },
    { name: "Deep Fog", href: "/deep-fog", icon: Cloud, description: "Immersive content" },
    { name: "Error Garden", href: "/error-garden", icon: Flower2, description: "Your error patterns" },
    { name: "Mystery Shelf", href: "/mystery-shelf", icon: BookOpen, description: "Collected unknowns" },
    { name: "Proficiency Tracker", href: "/proficiency-tracker", icon: TrendingUp, description: "Your CEFR progress" },
    { name: "Journey", href: "/journey", icon: ScrollText, description: "Your learning story" },
  ],
  quickTools: [
    { href: "/que-significa", label: "¿Qué significa?", icon: BookOpen },
    { href: "/como-se-pronuncia", label: "¿Cómo se pronuncia?", icon: Volume2 },
    { href: "/ask-tutor", label: "Ask Tutor", icon: MessageCircle },
  ],
}
