import React from "react"
import { StickyColumns, StickyColumnsProps } from "./StickyColumns"

export function WBS() {
  const startDate = new Date(2021, 6, 6)
  const startMonth = startDate.getMonth()
  const week = ["日", "月", "火", "水", "木", "金", "土"]
  const months = new Array(13).fill(0).map((_item, index) => {
    const year = startMonth + index <= 12 ? startDate.getFullYear() : startDate.getFullYear() + 1
    const month = (startMonth + index) % 12 || 12 // TODO: declare Month type,,,: 0 < Month < 13
    const endDate = new Date(year, month, 0).getDate()
    const _startDate = index === 0 ? startDate.getDate() : 1
    const _endDate = index === 12 ? startDate.getDate() - 1 : endDate
    return {
      year,
      month,
      startDate: _startDate,
      endDate: _endDate,
      startDay: new Date(year, month - 1, 1).getDay(),
      dateTotalCount: _endDate - _startDate + 1, // TODO: convert date Array: [6, 7, 8,,,,30] because this is selector
    }
  })
  const tasks = new Array(50).fill(0).map((_value, index) => "タスク その" + index)

  const dates = months
    .map(({ year, month, startDate, endDate, startDay }) => {
      return new Array(endDate - startDate + 1).fill(0).map((_item, index) => ({
        year,
        month,
        date: startDate + index,
        day: week[(startDay + index) % 6],
      }))
    })
    .reduce((acc, item) => [...acc, ...item], [])

  // TODO: rebuild years property,,,
  const years = months.reduce((acc, { year, dateTotalCount }) => {
    return {
      ...acc,
      [year]: {
        dateTotalCount: (acc[year]?.dateTotalCount || 0) + dateTotalCount,
      },
    }
  }, {} as { [key: string]: { dateTotalCount: number } })

  // Props
  const yearLabels: StickyColumnsProps["labels"] = Object.entries(years).map(
    ([year, { dateTotalCount }]) => ({
      label: year,
      cellLength: dateTotalCount,
    })
  )
  const monthLabels: StickyColumnsProps["labels"] = months.map((data) => ({
    label: data.month.toString(),
    cellLength: data.dateTotalCount,
  }))

  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #ccc",
      }}
    >
      <div>
        <div
          style={{
            width: "30px",
            height: "30px",
          }}
        ></div>
        <div
          style={{
            width: "30px",
            height: "30px",
          }}
        ></div>
        <div
          style={{
            width: "30px",
            height: "30px",
          }}
        ></div>
        <div
          style={{
            width: "30px",
            height: "30px",
          }}
        ></div>
        {tasks.map((task) => (
          <div
            key={`WBS_task_name_${task}`}
            style={{
              borderTop: "1px solid #ccc",
              display: "flex",
              width: "100px",
              height: "30px",
              flex: "0 0 30px",
              alignItems: "center",
            }}
          >
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {task}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          width: "1000px",
          overflowX: "auto",
          boxShadow: "1px 0 0 0 #ccc inset",
        }}
      >
        <StickyColumns labels={yearLabels} />
        <StickyColumns labels={monthLabels} />
        <div
          style={{
            display: "flex",
          }}
        >
          {dates.map(({ year, date, day, month }) => (
            <div key={`WBS_date_${year}_${month}_${date}`}>
              <div
                style={{
                  borderLeft: "1px solid #ccc",
                  borderTop: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  flex: "0 0 30px",
                  flexDirection: "column",
                }}
              >
                {date}
              </div>
              <div
                style={{
                  borderLeft: "1px solid #ccc",
                  borderTop: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  flex: "0 0 30px",
                  flexDirection: "column",
                }}
              >
                {day}
              </div>
            </div>
          ))}
        </div>
        {tasks.map((task) => (
          <div
            key={`WBS_task_${task}`}
            style={{
              display: "flex",
            }}
          >
            {dates.map(({ year, month, date }) => (
              <div
                key={`WBS_task_${task}_date_${year}_${month}_${date}`}
                style={{
                  borderLeft: "1px solid #ccc",
                  borderTop: "1px solid #ccc",
                  width: "30px",
                  height: "30px",
                  flex: "0 0 30px",
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WBS
