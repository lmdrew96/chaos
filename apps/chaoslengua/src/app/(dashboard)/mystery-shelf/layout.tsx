import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mystery Shelf",
  description: "Collect and explore unknown Spanish words with AI-powered analysis",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
