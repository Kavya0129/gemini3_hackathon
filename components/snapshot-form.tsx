'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { MonthlySnapshot } from '@/lib/types'
import { Plus, X, Calendar, DollarSign, TrendingUp, FileText, CheckCircle2 } from 'lucide-react'

interface SnapshotFormProps {
  snapshots: MonthlySnapshot[]
  onSave: (snapshot: MonthlySnapshot) => void
  onDelete: (id: string) => void
}

const majorEventSuggestions = [
  'Job change',
  'Salary increase',
  'Bonus received',
  'Medical expense',
  'Car repair',
  'Home improvement',
  'Vacation',
  'New subscription',
  'Cancelled subscription',
  'Gift/donation',
  'Tax refund',
  'Investment gain',
  'Investment loss',
]

export function SnapshotForm({ snapshots, onSave, onDelete }: SnapshotFormProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    month: new Date().toISOString().slice(0, 7),
    income: '',
    expenses: '',
    savings: '',
    majorEvents: [] as string[],
    notes: '',
    customEvent: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const snapshot: MonthlySnapshot = {
      id: crypto.randomUUID(),
      month: form.month,
      income: parseFloat(form.income) || 0,
      expenses: parseFloat(form.expenses) || 0,
      savings: parseFloat(form.savings) || 0,
      majorEvents: form.majorEvents,
      notes: form.notes,
      createdAt: new Date().toISOString(),
    }
    onSave(snapshot)
    setForm({
      month: new Date().toISOString().slice(0, 7),
      income: '',
      expenses: '',
      savings: '',
      majorEvents: [],
      notes: '',
      customEvent: '',
    })
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setIsAdding(false)
    }, 2000)
  }

  const addEvent = (event: string) => {
    if (!form.majorEvents.includes(event)) {
      setForm({ ...form, majorEvents: [...form.majorEvents, event] })
    }
  }

  const removeEvent = (event: string) => {
    setForm({ ...form, majorEvents: form.majorEvents.filter((e) => e !== event) })
  }

  const addCustomEvent = () => {
    if (form.customEvent.trim() && !form.majorEvents.includes(form.customEvent.trim())) {
      setForm({
        ...form,
        majorEvents: [...form.majorEvents, form.customEvent.trim()],
        customEvent: '',
      })
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

  const sortedSnapshots = [...snapshots].sort((a, b) => b.month.localeCompare(a.month))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Monthly Snapshots</h2>
          <p className="text-muted-foreground mt-1">
            Record your financial data without connecting any accounts
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Snapshot
          </Button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <Card className="border-primary/20 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              New Monthly Snapshot
            </CardTitle>
            <CardDescription>
              Enter your financial summary for the month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Snapshot Saved!</h3>
                <p className="text-muted-foreground mt-1">Your financial data has been recorded.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Month Selector */}
                <div className="space-y-2">
                  <Label htmlFor="month" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Month
                  </Label>
                  <Input
                    id="month"
                    type="month"
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                    className="max-w-xs"
                    required
                  />
                </div>

                {/* Financial Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Total Income
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="income"
                        type="number"
                        placeholder="0"
                        value={form.income}
                        onChange={(e) => setForm({ ...form, income: e.target.value })}
                        className="pl-7"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-chart-5" />
                      Total Expenses
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="expenses"
                        type="number"
                        placeholder="0"
                        value={form.expenses}
                        onChange={(e) => setForm({ ...form, expenses: e.target.value })}
                        className="pl-7"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="savings" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-chart-4" />
                      Savings This Month
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="savings"
                        type="number"
                        placeholder="0"
                        value={form.savings}
                        onChange={(e) => setForm({ ...form, savings: e.target.value })}
                        className="pl-7"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Major Events */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Major Events (Optional)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {majorEventSuggestions.map((event) => (
                      <Badge
                        key={event}
                        variant={form.majorEvents.includes(event) ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors"
                        onClick={() =>
                          form.majorEvents.includes(event) ? removeEvent(event) : addEvent(event)
                        }
                      >
                        {event}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add custom event..."
                      value={form.customEvent}
                      onChange={(e) => setForm({ ...form, customEvent: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomEvent()
                        }
                      }}
                      className="max-w-xs"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addCustomEvent}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {form.majorEvents.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-3 bg-muted/50 rounded-lg">
                      <span className="text-xs text-muted-foreground mr-2">Selected:</span>
                      {form.majorEvents.map((event) => (
                        <Badge key={event} variant="secondary" className="gap-1">
                          {event}
                          <button type="button" onClick={() => removeEvent(event)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional context about this month..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button type="submit">Save Snapshot</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Snapshot History */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">History</h3>
        {sortedSnapshots.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No snapshots yet. Add your first one above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedSnapshots.map((snapshot) => (
              <Card key={snapshot.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-medium">
                          {new Date(snapshot.month + '-01').toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDelete(snapshot.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Income</p>
                          <p className="font-semibold text-foreground">{formatCurrency(snapshot.income)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expenses</p>
                          <p className="font-semibold text-foreground">{formatCurrency(snapshot.expenses)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Savings</p>
                          <p className="font-semibold text-primary">{formatCurrency(snapshot.savings)}</p>
                        </div>
                      </div>
                      {snapshot.majorEvents.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {snapshot.majorEvents.map((event) => (
                            <Badge key={event} variant="secondary" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {snapshot.notes && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{snapshot.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
