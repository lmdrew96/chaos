import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "¿Qué significa?",
  description: "Look up Spanish words and phrases with AI-powered definitions and examples",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
