"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import type { ReactNode } from "react"

type GridStudentIdProps = {
  component1: ReactNode
  component2: ReactNode
  component3: ReactNode
  component4: ReactNode
  component5: ReactNode
}

export default function GridStudentId({
  component1,
  component2,
  component3,
  component4,
  component5,
}: GridStudentIdProps) {
  const isMobile = useIsMobile()

  return (
    <div className="w-full mx-auto">
      <div
        className={`
          grid gap-4
          ${isMobile ? "grid-cols-1" : "h-[800px]"}
        `}
        style={
          !isMobile
            ? {
              display: "grid",
              gridTemplateAreas: `
                  "one two three"
                  "four four three"
                  "four four five"
                `,
              gridTemplateRows: "auto 1fr 1fr",
              gridTemplateColumns: "1fr 1fr 1fr",
            }
            : undefined
        }
      >
        <GridItem area="one" order={2} isMobile={isMobile}>
          {component1}
        </GridItem>
        <GridItem area="two" order={3} isMobile={isMobile}>
          {component2}
        </GridItem>
        <GridItem area="three" order={1} isMobile={isMobile}>
          {component3}
        </GridItem>
        <GridItem area="four" order={4} isMobile={isMobile}>
          {component4}
        </GridItem>
        <GridItem area="five" order={5} isMobile={isMobile}>
          {component5}
        </GridItem>
      </div>
    </div>
  )
}

function GridItem({
  area,
  order,
  isMobile,
  children,
}: {
  area: string
  order: number
  isMobile: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`
        flex items-center justify-center rounded-lg p-4 bg-white
        ${isMobile ? `order-${order}` : ""}
      `}
      style={!isMobile ? { gridArea: area } : undefined}
    >
      {children}
    </div>
  )
}
