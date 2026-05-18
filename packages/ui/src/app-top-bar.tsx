"use client"

import { useState } from "react"
import { User, Settings, LogOut, Sparkles, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType } from "react"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import type { LangConfigUI } from "@chaos/lang-config"

export interface AppTopBarUser {
  displayName: string;
  email: string;
  initials: string;
  imageUrl?: string;
}

interface GuideProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AppTopBarProps {
  ui: Pick<LangConfigUI, 'brandName' | 'logoStrokePath' | 'quickTools'>
  user?: AppTopBarUser
  onSignOut?: () => void
  onOpenProfile?: () => void
  GuideComponent?: ComponentType<GuideProps>
}

export function AppTopBar({ ui, user, onSignOut, onOpenProfile, GuideComponent }: AppTopBarProps) {
  const { brandName, logoStrokePath, quickTools } = ui
  const pathname = usePathname()
  const showQuickTools = pathname !== "/"
  const [guideOpen, setGuideOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-lg px-6">
      <div className="flex items-center gap-4">
        <Link href="/home" className="md:hidden flex items-center gap-2 ml-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 28"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary shrink-0"
          >
            <path d={logoStrokePath} />
            <g transform="translate(0, 4)">
              <circle cx="12" cy="12" r="1" />
              <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
              <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
            </g>
          </svg>
          <span className="font-bold text-sm bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
            {brandName}
          </span>
        </Link>
        <div className="hidden md:block">
          <h2 className="text-sm font-medium text-muted-foreground">
            Welcome back
          </h2>
          <p className="text-xs text-muted-foreground/60">
            Ready for some productive chaos?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {GuideComponent && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGuideOpen(true)}
            className="h-10 w-10 rounded-full hover:bg-chart-4/10 transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}

        {showQuickTools && quickTools.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
              >
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 rounded-xl" align="end">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Quick Tools</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickTools.map((tool) => (
                <DropdownMenuItem key={tool.href} className="cursor-pointer" asChild>
                  <Link href={tool.href}>
                    <tool.icon className="mr-2 h-4 w-4" />
                    {tool.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.imageUrl ?? ""} alt={user?.displayName ?? "User"} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm">
                  {user?.initials ?? "CL"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.displayName ?? "Chaos Learner"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email ?? "Chaos Learner"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onOpenProfile && (
              <DropdownMenuItem className="cursor-pointer" onClick={onOpenProfile}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onSignOut && (
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={onSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {GuideComponent && <GuideComponent isOpen={guideOpen} onOpenChange={setGuideOpen} />}
    </header>
  )
}
