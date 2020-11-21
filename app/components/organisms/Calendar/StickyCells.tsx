import React from "react"
import { StickyCell } from "./StickyCell"

export type StickyCellsProps = {
  label: string
  cellLength: number
}
export const StickyCells: React.FC<StickyCellsProps> = ({ label, cellLength }) => {
  return (
    <div
      key={`StickyCells_${label}`}
      style={{
        display: "flex",
      }}
    >
      {new Array(cellLength).fill(0).map((_data, index) => {
        const cellLabel = index === 0 ? label : ""
        return <StickyCell key={`StickyCells_cell_${label}_${index}`} label={cellLabel} />
      })}
    </div>
  )
}
