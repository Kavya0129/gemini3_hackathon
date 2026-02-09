'use client'

import React from "react"
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { TabType } from '@/lib/types'
import {
  LayoutDashboard,
  CalendarPlus,
  MessageSquareText,
  Calculator,
  Newspaper,
  Shield,
  Menu,
  X,
  LogOut,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'snapshot', label: 'Monthly Snapshot', icon: <CalendarPlus className="h-5 w-5" /> },
  { id: 'copilot', label: 'AI Copilot', icon: <MessageSquareText className="h-5 w-5" /> },
  { id: 'simulator', label: 'Life Simulator', icon: <Calculator className="h-5 w-5" /> },
  { id: 'investment', label: 'Investment Guide', icon: <TrendingUp className="h-5 w-5" /> },
  { id: 'news', label: 'Economic News', icon: <Newspaper className="h-5 w-5" /> },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary">
              <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Finwise</h1>
              <p className="text-xs text-sidebar-foreground/60">Privacy-first finance</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  setMobileOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  activeTab === item.id
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Info and Privacy badge */}
          <div className="px-4 py-4 border-t border-sidebar-border space-y-3">
            {user && (
              <div className="px-3 py-2 rounded-lg bg-sidebar-accent/30">
                <p className="text-xs font-medium text-sidebar-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {user.email}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50">
              <Shield className="h-4 w-4 text-sidebar-primary" />
              <span className="text-xs text-sidebar-foreground/70">
                Your data stays on your device
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
