import React from "react"

type StickyCellProps = {
  label: string
  index: number
}
export const StickyCell: React.FC<StickyCellProps> = ({ label, index }) => {
  return (
    <div
      style={{
        position: label ? "sticky" : "static",
        display: "flex",
        alignItems: "center",
        width: "30px",
        height: "30px",
        flex: "0 0 30px",
        paddingLeft: "10px",
        whiteSpace: "nowrap",
        left: label ? 0 : "auto",
      }}
    >
      {label ? label : ""}
    </div>
  )
}
