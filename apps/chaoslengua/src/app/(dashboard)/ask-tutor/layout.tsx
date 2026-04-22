import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ask Tutor",
  description: "Chat with your AI Spanish tutor for personalized language help",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
