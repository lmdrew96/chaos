"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { AppTopBar } from "@chaos/ui"
import type { AppTopBarUser } from "@chaos/ui"
import { langUI } from "@/lang.config"
import { ChaosGuide } from "@/components/features/chaos-guide/ChaosGuide"

export function TopBar() {
  const { signOut, openUserProfile } = useClerk()
  const { user } = useUser()

  const topBarUser: AppTopBarUser | undefined = user
    ? {
        displayName: user.firstName
          ? user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName
          : (user.emailAddresses?.[0]?.emailAddress ?? "Chaos Learner"),
        email: user.emailAddresses?.[0]?.emailAddress ?? "Chaos Learner",
        initials: user.firstName && user.lastName
          ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
          : user.firstName
          ? user.firstName[0].toUpperCase()
          : (user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "CL"),
        imageUrl: user.imageUrl || undefined,
      }
    : undefined

  const handleSignOut = async () => {
    await signOut(() => { window.location.href = "/" })
  }

  return (
    <AppTopBar
      ui={langUI}
      user={topBarUser}
      onSignOut={handleSignOut}
      onOpenProfile={() => openUserProfile()}
      GuideComponent={ChaosGuide}
    />
  )
}
