'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Dashboard } from '@/components/dashboard'
import { SnapshotForm } from '@/components/snapshot-form'
import { AICopilot } from '@/components/ai-copilot'
import { LifeSimulator } from '@/components/life-simulator'
import { NewsFeed } from '@/components/news-feed'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { TabType, MonthlySnapshot, UserProfile } from '@/lib/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [snapshots, setSnapshots, snapshotsLoaded] = useLocalStorage<MonthlySnapshot[]>(
    'finwise-snapshots',
    []
  )
  const [profile, setProfile, profileLoaded] = useLocalStorage<UserProfile | null>(
    'finwise-profile',
    null
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveSnapshot = (snapshot: MonthlySnapshot) => {
    setSnapshots((prev) => {
      const existingIndex = prev.findIndex((s) => s.month === snapshot.month)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = snapshot
        return updated
      }
      return [...prev, snapshot]
    })
  }

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id))
  }

  const handleNavigate = (tab: TabType) => {
    setActiveTab(tab)
  }

  // Wait for client-side hydration
  if (!mounted || !snapshotsLoaded || !profileLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="p-6 pt-16 lg:pt-6 max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              snapshots={snapshots}
              profile={profile}
              onNavigate={handleNavigate}
            />
          )}
          {activeTab === 'snapshot' && (
            <SnapshotForm
              snapshots={snapshots}
              onSave={handleSaveSnapshot}
              onDelete={handleDeleteSnapshot}
            />
          )}
          {activeTab === 'copilot' && (
            <AICopilot snapshots={snapshots} profile={profile} />
          )}
          {activeTab === 'simulator' && (
            <LifeSimulator snapshots={snapshots} />
          )}
          {activeTab === 'news' && (
            <NewsFeed snapshots={snapshots} profile={profile} />
          )}
        </div>
      </main>
    </div>
  )
}
