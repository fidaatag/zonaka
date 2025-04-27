"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  value: number
  description?: string
  icon?: React.ReactNode
  trend?: number
  className?: string
  valuePrefix?: string
  valueSuffix?: string
}

export default function CardCountingBoard({
  title,
  value,
  description,
  icon = <BarChart3 className="h-4 w-4" />,
  trend,
  className,
  valuePrefix = "",
  valueSuffix = "",
}: DashboardCardProps) {
  const [count, setCount] = useState(0)

  // Animate the count value
  useEffect(() => {
    const duration = 1000
    const steps = 20
    const stepTime = duration / steps
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {valuePrefix}
          {count.toLocaleString()}
          {valueSuffix}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend !== undefined && (
          <div className="mt-2 flex items-center text-xs">
            {trend > 0 ? (
              <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
            ) : (
              <ArrowDown className="mr-1 h-3 w-3 text-rose-500" />
            )}
            <span className={cn("font-medium", trend > 0 ? "text-emerald-500" : "text-rose-500")}>
              {Math.abs(trend)}%
            </span>
            <span className="ml-1 text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
