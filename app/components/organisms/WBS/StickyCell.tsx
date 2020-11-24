import React from "react"

type StickyCellProps = {
  label: string
  index: number
}
export const StickyCell: React.FC<StickyCellProps> = ({ label, index }) => {
  return (
    <div
      style={{
        borderLeft: label && index > 0 ? "1px solid #ccc" : "none",
        position: label ? "sticky" : "static",
        display: "flex",
        justifyContent: "center",
        width: "30px",
        height: "30px",
        flex: "0 0 30px",
        flexDirection: "column",
        left: label ? 0 : "auto",
      }}
    >
      {label ? label : ""}
    </div>
  )
}
