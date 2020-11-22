import React from "react"

type StickyCellProps = {
  label: string
}
export const StickyCell: React.FC<StickyCellProps> = ({ label }) => {
  return (
    <div
      style={{
        borderLeft: label ? "1px solid #ccc" : "none",
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
