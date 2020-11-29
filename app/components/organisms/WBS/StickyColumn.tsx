import React from "react"
import { StickyCell } from "./StickyCell"

export type StickyColumnProps = {
  label: string
  cellLength: number
}
export const StickyColumn: React.FC<StickyColumnProps> = ({ label, cellLength }) => {
  return (
    <div
      key={`StickyColumn_${label}`}
      style={{
        display: "flex",
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      {new Array(cellLength).fill(0).map((_data, index) => {
        const cellLabel = index === 0 ? label : ""
        return (
          <StickyCell key={`StickyColumn_cell_${label}_${index}`} label={cellLabel} index={index} />
        )
      })}
    </div>
  )
}
