import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Proficiency Tracker",
  description: "Track your Spanish language progress across grammar, vocabulary, and pronunciation",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
