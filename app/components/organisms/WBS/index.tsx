import React, { useState, useCallback } from "react"
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
  const tasks = new Array(50).fill(0).map((_value, index) => ({
    id: index,
    label: "タスク その" + index,
    startDate: "2020/6/25",
    endDate: "2020/7/7",
    md: 13,
    player: "WBS 太郎",
    status: "着手中",
  }))

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

  const headerRef = React.createRef<HTMLDivElement>()
  const gridRef = React.createRef<HTMLDivElement>()
  const handleHeaderScroll = (e: React.UIEvent<HTMLElement>) => {
    gridRef!.current!.scrollLeft = e.currentTarget.scrollLeft
  }
  const handleGridScroll = (e: React.UIEvent<HTMLElement>) => {
    headerRef!.current!.scrollLeft = e.currentTarget.scrollLeft
  }

  return (
    <div
      className="WBS"
      style={{
        display: "grid",
        gridTemplateColumns: "631px 1fr", // TODO: What is 630 + "1" px...
        gridTemplateRows: "123px 1fr", // TODO: What is 120 + "3" px...
        width: "100vw",
        zIndex: 0,
        border: "1px solid #ccc",
      }}
    >
      <header
        className="WBS__header"
        style={{
          gridColumn: "1 / 3",
          gridRow: 1,
          display: "flex",
          borderBottom: "1px solid #ccc",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 3,
        }}
      >
        <div
          className="WBS__header-tasks"
          style={{
            flex: "0 0 630px",
            paddingTop: "91px", // TODO: What is 90 + "1" px...
            borderRight: "1px solid #ccc",
          }}
        >
          <div
            style={{
              borderTop: "1px solid #ccc",
              display: "flex",
              height: "30px",
              flex: "0 0 30px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "180px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              タスク
            </div>
            <div
              style={{
                width: "30px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              MD
            </div>
            <div
              style={{
                width: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              担当者
            </div>
            <div
              style={{
                width: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              開始予定日
            </div>
            <div
              style={{
                width: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              終了予定日
            </div>
            <div
              style={{
                width: "60px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              状態
            </div>
          </div>
        </div>
        <div
          className="WBS__header-dates"
          style={{
            flex: "0 0 calc(100vw - 630px)",
            overflowX: "auto",
          }}
          ref={headerRef}
          onScroll={handleHeaderScroll}
        >
          <StickyColumns labels={yearLabels} />
          <StickyColumns labels={monthLabels} />
          <div
            style={{
              display: "flex",
            }}
          >
            {dates.map(({ year, date, day, month }, index) => (
              <div key={`WBS_date_${year}_${month}_${date}`}>
                <div
                  style={{
                    borderLeft: index === 0 ? "none" : "1px solid #ccc",
                    borderBottom: "1px solid #ccc",
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
                    borderLeft: index === 0 ? "none" : "1px solid #ccc",
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
        </div>
      </header>
      <div
        className="WBS__task"
        style={{
          gridColumn: 1,
          gridRow: 2,
          borderRight: "1px solid #ccc",
          zIndex: 2,
        }}
      >
        {tasks.map((task) => (
          <div
            key={`WBS_task_name_${task.id}`}
            style={{
              borderBottom: "1px solid #ccc",
              display: "flex",
              height: "30px",
            }}
          >
            <div
              style={{
                width: "180px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.label}
            </div>
            <div
              style={{
                width: "30px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.md}
            </div>
            <div
              style={{
                width: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.player}
            </div>
            <div
              style={{
                width: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.startDate}
            </div>
            <div
              style={{
                width: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.endDate}
            </div>
            <div
              style={{
                width: "60px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.status}
            </div>
          </div>
        ))}
      </div>
      <div
        className="WBS_grid"
        style={{
          gridColumn: 2,
          gridRow: 2,
          overflowX: "auto",
          zIndex: 1,
        }}
        ref={gridRef}
        onScroll={handleGridScroll}
      >
        {tasks.map((task) => (
          <div
            key={`WBS_task_${task.id}`}
            style={{
              display: "flex",
            }}
          >
            {dates.map(({ year, month, date }, index) => (
              <div
                key={`WBS__${task.id}_date_${year}_${month}_${date}`}
                style={{
                  borderLeft: index === 0 ? "none" : "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
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
