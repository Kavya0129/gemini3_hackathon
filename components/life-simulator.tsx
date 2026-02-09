"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import type { MonthlySnapshot } from "@/lib/types";
import type { SimulationOutput } from "@/app/api/simulate/route";
import {
  Calculator,
  Briefcase,
  Car,
  Home,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Loader2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  Lightbulb,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LifeSimulatorProps {
  snapshots: MonthlySnapshot[];
}

type ScenarioType =
  | "career"
  | "loan"
  | "purchase"
  | "investment"
  | "education"
  | "custom";

interface Scenario {
  id: ScenarioType;
  name: string;
  icon: React.ReactNode;
  description: string;
  fields: {
    name: string;
    label: string;
    type: "number" | "text";
    placeholder: string;
    prefix?: string;
  }[];
}

const scenarios: Scenario[] = [
  {
    id: "career",
    name: "Career Change",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Evaluate salary changes, job transitions, or promotions",
    fields: [
      {
        name: "currentSalary",
        label: "Current Annual Salary",
        type: "number",
        placeholder: "75000",
        prefix: "$",
      },
      {
        name: "newSalary",
        label: "New Annual Salary",
        type: "number",
        placeholder: "90000",
        prefix: "$",
      },
      {
        name: "transitionCosts",
        label: "Transition Costs",
        type: "number",
        placeholder: "5000",
        prefix: "$",
      },
      {
        name: "description",
        label: "Additional Details",
        type: "text",
        placeholder: "e.g., Remote work, better benefits...",
      },
    ],
  },
  {
    id: "loan",
    name: "Taking a Loan",
    icon: <Home className="h-5 w-5" />,
    description: "Analyze mortgage, car loan, or personal loan impact",
    fields: [
      {
        name: "loanAmount",
        label: "Loan Amount",
        type: "number",
        placeholder: "250000",
        prefix: "$",
      },
      {
        name: "interestRate",
        label: "Annual Interest Rate (%)",
        type: "number",
        placeholder: "6.5",
      },
      {
        name: "termYears",
        label: "Loan Term (years)",
        type: "number",
        placeholder: "30",
      },
      {
        name: "description",
        label: "Purpose",
        type: "text",
        placeholder: "e.g., Home purchase, refinancing...",
      },
    ],
  },
  {
    id: "purchase",
    name: "Major Purchase",
    icon: <Car className="h-5 w-5" />,
    description: "Evaluate big-ticket items like cars or renovations",
    fields: [
      {
        name: "purchasePrice",
        label: "Purchase Price",
        type: "number",
        placeholder: "35000",
        prefix: "$",
      },
      {
        name: "downPayment",
        label: "Down Payment",
        type: "number",
        placeholder: "7000",
        prefix: "$",
      },
      {
        name: "monthlyMaintenance",
        label: "Monthly Running Cost",
        type: "number",
        placeholder: "200",
        prefix: "$",
      },
      {
        name: "description",
        label: "What are you buying?",
        type: "text",
        placeholder: "e.g., New car, home renovation...",
      },
    ],
  },
  {
    id: "investment",
    name: "Investment",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Project returns on investments or side businesses",
    fields: [
      {
        name: "initialInvestment",
        label: "Initial Investment",
        type: "number",
        placeholder: "10000",
        prefix: "$",
      },
      {
        name: "monthlyContribution",
        label: "Monthly Contribution",
        type: "number",
        placeholder: "500",
        prefix: "$",
      },
      {
        name: "expectedReturn",
        label: "Expected Annual Return (%)",
        type: "number",
        placeholder: "7",
      },
      {
        name: "description",
        label: "Investment Type",
        type: "text",
        placeholder: "e.g., Index funds, business, real estate...",
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Evaluate going back to school or certifications",
    fields: [
      {
        name: "totalCost",
        label: "Total Education Cost",
        type: "number",
        placeholder: "50000",
        prefix: "$",
      },
      {
        name: "duration",
        label: "Duration (months)",
        type: "number",
        placeholder: "24",
      },
      {
        name: "expectedSalaryIncrease",
        label: "Expected Salary Increase After",
        type: "number",
        placeholder: "15000",
        prefix: "$",
      },
      {
        name: "description",
        label: "Program Details",
        type: "text",
        placeholder: "e.g., MBA, coding bootcamp, certification...",
      },
    ],
  },
  {
    id: "custom",
    name: "Custom Scenario",
    icon: <Calculator className="h-5 w-5" />,
    description: "Describe any financial decision for analysis",
    fields: [
      {
        name: "upfrontCost",
        label: "Upfront Cost",
        type: "number",
        placeholder: "5000",
        prefix: "$",
      },
      {
        name: "monthlyImpact",
        label: "Monthly Cost/Benefit (+/-)",
        type: "number",
        placeholder: "-200",
        prefix: "$",
      },
      {
        name: "description",
        label: "Describe your scenario in detail",
        type: "text",
        placeholder: "Explain the financial decision you want to simulate...",
      },
    ],
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

// --- Sub-components for results ---

function VerdictBanner({ result }: { result: SimulationOutput }) {
  const verdictConfig = {
    recommended: {
      icon: ShieldCheck,
      label: "Recommended",
      bg: "bg-primary/10",
      border: "border-primary/30",
      text: "text-primary",
      badgeClass: "bg-primary/15 text-primary border-primary/30",
    },
    cautious: {
      icon: ShieldAlert,
      label: "Proceed with Caution",
      bg: "bg-accent/10",
      border: "border-accent/30",
      text: "text-accent",
      badgeClass: "bg-accent/15 text-accent border-accent/30",
    },
    not_recommended: {
      icon: ShieldX,
      label: "Not Recommended",
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      text: "text-destructive",
      badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
    },
  };

  const config = verdictConfig[result.verdict];
  const Icon = config.icon;

  return (
    <Card className={cn("border", config.border, config.bg)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              config.bg
            )}
          >
            <Icon className={cn("h-6 w-6", config.text)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={config.badgeClass}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {result.summary}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {result.verdictReason}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyImpactCards({ result }: { result: SimulationOutput }) {
  const diff = result.monthlyImpact.monthlyDifference;
  const isPositive = diff >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Current Monthly Savings
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(result.monthlyImpact.currentMonthlySavings)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Projected Monthly Savings
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(result.monthlyImpact.projectedMonthlySavings)}
          </p>
        </CardContent>
      </Card>
      <Card
        className={cn(
          "border",
          isPositive ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
        )}
      >
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Monthly Change
          </p>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-primary" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <p
              className={cn(
                "text-2xl font-semibold",
                isPositive ? "text-primary" : "text-destructive"
              )}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(diff)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const projectionChartConfig: ChartConfig = {
  withDecision: {
    label: "With Decision",
    color: "#16a34a",
  },
  withoutDecision: {
    label: "Without Decision",
    color: "#6b7280",
  },
};

function ProjectionChart({ result }: { result: SimulationOutput }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Financial Trajectory</CardTitle>
        <CardDescription>
          Your projected savings with vs. without this decision
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={projectionChartConfig} className="h-[300px] w-full">
          <AreaChart
            data={result.projectionTimeline}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradWith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradWithout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b7280" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6b7280" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const label =
                      name === "withDecision"
                        ? "With Decision"
                        : "Without Decision";
                    return (
                      <span>
                        {label}: {formatCurrency(Number(value))}
                      </span>
                    );
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="withoutDecision"
              stroke="#6b7280"
              strokeWidth={2}
              fill="url(#gradWithout)"
              strokeDasharray="6 3"
            />
            <Area
              type="monotone"
              dataKey="withDecision"
              stroke="#16a34a"
              strokeWidth={2.5}
              fill="url(#gradWith)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const BREAKDOWN_COLORS = [
  "#16a34a",
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const breakdownChartConfig: ChartConfig = {
  amount: { label: "Amount" },
};

function CostBreakdownChart({ result }: { result: SimulationOutput }) {
  const data = result.breakdownCategories.map((item, i) => ({
    ...item,
    fill: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length],
    absAmount: Math.abs(item.amount),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Cost / Benefit Breakdown</CardTitle>
        <CardDescription>
          Financial components of this decision
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={breakdownChartConfig} className="h-[280px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(v) => {
                const abs = Math.abs(v);
                if (abs >= 1000) return `$${(v / 1000).toFixed(0)}k`;
                return `$${v}`;
              }}
            />
            <YAxis
              type="category"
              dataKey="category"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={120}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={28}>
              {data.map((entry, i) => (
                <Cell
                  key={entry.category}
                  fill={entry.amount >= 0 ? "#16a34a" : "#ef4444"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RiskGauge({ result }: { result: SimulationOutput }) {
  const riskData = [{ value: result.riskScore, fill: "transparent" }];
  const riskColor =
    result.riskScore <= 3
      ? "#16a34a"
      : result.riskScore <= 6
        ? "#f59e0b"
        : "#ef4444";
  const riskLabel =
    result.riskScore <= 3
      ? "Low Risk"
      : result.riskScore <= 6
        ? "Medium Risk"
        : "High Risk";

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base">Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pb-4">
        <div className="relative w-40 h-40">
          <RadialBarChart
            width={160}
            height={160}
            innerRadius={55}
            outerRadius={75}
            data={riskData}
            startAngle={210}
            endAngle={-30}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 10]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={12}
              fill={riskColor}
              background={{ fill: "hsl(var(--muted))" }}
            />
          </RadialBarChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: riskColor }}>
              {result.riskScore}
            </span>
            <span className="text-xs text-muted-foreground">/10</span>
          </div>
        </div>
        <Badge
          variant="outline"
          className="mt-2"
          style={{
            borderColor: riskColor,
            color: riskColor,
          }}
        >
          {riskLabel}
        </Badge>
      </CardContent>
    </Card>
  );
}

function BreakEvenCard({ result }: { result: SimulationOutput }) {
  if (result.breakEvenMonths === null || result.breakEvenMonths === undefined) {
    return null;
  }

  const years = Math.floor(result.breakEvenMonths / 12);
  const months = result.breakEvenMonths % 12;
  const label = years > 0 ? `${years}y ${months}m` : `${months} months`;

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base">Break-Even Point</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Clock className="h-7 w-7 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">
          ~{result.breakEvenMonths} months to recover your costs
        </p>
      </CardContent>
    </Card>
  );
}

function InsightsSection({ result }: { result: SimulationOutput }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-accent" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {result.keyInsights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-foreground leading-relaxed">
                {insight}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function AlternativesSection({ result }: { result: SimulationOutput }) {
  if (!result.alternativeSuggestions?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ArrowUpRight className="h-4 w-4 text-primary" />
          Alternative Approaches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {result.alternativeSuggestions.map((alt, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {alt.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {alt.description}
                </p>
                {alt.potentialSaving != null && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Potential savings: {formatCurrency(alt.potentialSaving)}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Component ---

export function LifeSimulator({ snapshots }: LifeSimulatorProps) {
  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioType | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SimulationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const financialContext = useMemo(() => {
    if (snapshots.length === 0) {
      return "No financial data available. User has not added any monthly snapshots yet. Use reasonable defaults for a typical middle-income individual.";
    }

    const sorted = [...snapshots].sort((a, b) =>
      a.month.localeCompare(b.month)
    );
    const totalIncome = sorted.reduce((sum, s) => sum + s.income, 0);
    const totalExpenses = sorted.reduce((sum, s) => sum + s.expenses, 0);
    const totalSavings = sorted.reduce((sum, s) => sum + s.savings, 0);
    const avgIncome = totalIncome / sorted.length;
    const avgExpenses = totalExpenses / sorted.length;
    const avgSavings = totalSavings / sorted.length;

    return `
FINANCIAL PROFILE (${sorted.length} months of data):
- Average Monthly Income: $${avgIncome.toLocaleString()}
- Average Monthly Expenses: $${avgExpenses.toLocaleString()}
- Average Monthly Savings: $${avgSavings.toLocaleString()}
- Total Accumulated Savings: $${totalSavings.toLocaleString()}
- Savings Rate: ${((avgSavings / avgIncome) * 100).toFixed(1)}%

MONTHLY HISTORY:
${sorted.map((s) => `${s.month}: Income $${s.income}, Expenses $${s.expenses}, Savings $${s.savings}`).join("\n")}
`.trim();
  }, [snapshots]);

  const currentScenario = scenarios.find((s) => s.id === selectedScenario);

  const handleSimulate = async () => {
    if (!currentScenario) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioType: currentScenario.name,
          parameters: formData,
          financialContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to run simulation");
      }

      const data = await response.json();
      setResult(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setFormData({});
    setResult(null);
    setError(null);
  };

  const handleBackToResults = () => {
    setResult(null);
  };

  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Calculator className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Add Financial Data First
        </h2>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          The Life Simulator needs your financial snapshots to provide accurate
          projections. Add at least one monthly snapshot to get started.
        </p>
      </div>
    );
  }

  // --- Results View ---
  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Simulation Results
            </h2>
            <p className="text-muted-foreground text-sm">
              {currentScenario?.name} analysis based on your financial profile
            </p>
          </div>
        </div>

        {/* Verdict */}
        <VerdictBanner result={result} />

        {/* Monthly Impact Cards */}
        <MonthlyImpactCards result={result} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectionChart result={result} />
          <CostBreakdownChart result={result} />
        </div>

        {/* Risk + Break-Even Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RiskGauge result={result} />
          <BreakEvenCard result={result} />
          <InsightsSection result={result} />
        </div>

        {/* Alternatives */}
        <AlternativesSection result={result} />

        {/* Run Again */}
        <div className="flex justify-center pt-2 pb-4">
          <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
            <Calculator className="h-4 w-4" />
            Run Another Simulation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Life Decision Simulator
        </h2>
        <p className="text-muted-foreground mt-1">
          Model the financial impact of major life decisions with AI-powered
          projections
        </p>
      </div>

      {!selectedScenario ? (
        /* Scenario Selection */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group"
              )}
              onClick={() => setSelectedScenario(scenario.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {scenario.icon}
                  </div>
                  <CardTitle className="text-base">{scenario.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{scenario.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Simulation Form */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={handleReset}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {currentScenario?.icon}
                </div>
                <div>
                  <CardTitle>{currentScenario?.name}</CardTitle>
                  <CardDescription>
                    {currentScenario?.description}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentScenario?.fields.map((field) => (
                <div
                  key={field.name}
                  className={cn(
                    "space-y-2",
                    field.type === "text" && field.name === "description" && "md:col-span-2"
                  )}
                >
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "text" && field.name === "description" ? (
                    <Textarea
                      id={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.name]: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <div className="relative">
                      {field.prefix && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {field.prefix}
                        </span>
                      )}
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.name]: e.target.value,
                          })
                        }
                        className={field.prefix ? "pl-7" : ""}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              className="w-full mt-4 gap-2"
              size="lg"
              onClick={handleSimulate}
              disabled={isLoading || Object.keys(formData).length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating analysis...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Run Simulation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
