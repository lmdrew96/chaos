import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "¿Cómo se pronuncia?",
  description: "Practice Spanish pronunciation with AI feedback and audio playback",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
