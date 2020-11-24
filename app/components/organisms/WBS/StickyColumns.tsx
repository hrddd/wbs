import React from "react"
import { StickyColumn, StickyColumnProps } from "./StickyColumn"

export type StickyColumnsProps = {
  labels: StickyColumnProps[]
}
export const StickyColumns: React.FC<StickyColumnsProps> = ({ labels }) => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {labels.map(({ label, cellLength }, index) => {
        return (
          <div
            key={`StickyColumns_${label}_${index}`}
            style={{
              display: "flex",
              borderBottom: "1px solid #ccc",
            }}
          >
            <StickyColumn label={label} cellLength={cellLength} />
          </div>
        )
      })}
    </div>
  )
}
