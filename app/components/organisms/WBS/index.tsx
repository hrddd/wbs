import React, { useState, useCallback } from "react"
import { StickyColumns, StickyColumnsProps } from "./StickyColumns"

const CELL_HEIGHT = 30
const CELL_WIDTH = 30

type GetTaskBarRectPropsProps = {
  startDate: Date
  endDate: Date
  gridStartDate: Date
  gridEndDate: Date
  isDangerous: boolean
}
const getTaskBarRectProps = ({
  startDate,
  endDate,
  gridStartDate,
  gridEndDate,
  isDangerous,
}: GetTaskBarRectPropsProps) => {
  const startTime = Math.max(startDate.getTime(), gridStartDate.getTime())
  const endTime = Math.min(endDate.getTime(), gridEndDate.getTime())
  const color = isDangerous ? "rgba(255, 120, 120, .5)" : "rgba(120, 196, 120, .5)"
  return {
    x: ((startTime - gridStartDate.getTime()) / (1000 * 24 * 60 * 60)) * CELL_WIDTH,
    width: ((endTime - startTime) / (1000 * 24 * 60 * 60) + 1) * CELL_WIDTH,
    fill: color,
  }
}

export function WBS() {
  const today = new Date("2020/6/30")
  const gridStartDate = new Date("2020/6/6")
  const gridEndDate = new Date("2021/6/5")
  const week = ["日", "月", "火", "水", "木", "金", "土"]
  const months = new Array(13).fill(0).map((_item, index) => {
    const startMonth = gridStartDate.getMonth() + 1
    const year =
      startMonth + index <= 12 ? gridStartDate.getFullYear() : gridStartDate.getFullYear() + 1
    const month = (startMonth + index) % 12 || 12 // TODO: declare Month type,,,: 0 < Month < 13
    const endDate = new Date(year, month, 0).getDate()
    const _startDate = index === 0 ? gridStartDate.getDate() : 1
    const _endDate = index === 12 ? gridStartDate.getDate() - 1 : endDate
    return {
      year,
      month,
      startDate: _startDate,
      endDate: _endDate,
      startDay: new Date(year, month - 1, 1).getDay(),
      dateTotalCount: _endDate - _startDate + 1, // TODO: convert date Array: [6, 7, 8,,,,30] because this is selector
    }
  })
  const tasks = new Array(50).fill(0).map((_value, index) => {
    const fastStartDate = new Date("2020/6/25")
    const lateStartDate = new Date("2020/7/25")
    return {
      id: index,
      label: "タスク その" + index,
      startDate: index === 3 ? fastStartDate : lateStartDate,
      endDate: new Date("2020/7/31"),
      md: 13,
      player: "WBS 太郎",
      status: "着手中",
      isDangerous:
        index === 3
          ? today.getTime() > fastStartDate.getTime()
          : today.getTime() > lateStartDate.getTime(),
    }
  })

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
            {dates.map(({ year, date, day, month }, index) => {
              const isToday = today.getTime() === new Date(`${year}/${month}/${date}`).getTime()
              return (
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
                      backgroundColor: isToday ? "rgba(232, 232, 72, .5)" : "#fff",
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
                      backgroundColor: isToday ? "rgba(232, 232, 72, .5)" : "#fff",
                    }}
                  >
                    {day}
                  </div>
                </div>
              )
            })}
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
              {task.startDate.toLocaleDateString()}
            </div>
            <div
              style={{
                width: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.endDate.toLocaleDateString()}
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
        className="WBS__grid"
        style={{
          gridColumn: 2,
          gridRow: 2,
          overflowX: "auto",
          zIndex: 1,
        }}
        ref={gridRef}
        onScroll={handleGridScroll}
      >
        {tasks.map((task) => {
          const TaskBarRectProps = getTaskBarRectProps({
            startDate: task.startDate,
            endDate: task.endDate,
            gridStartDate: gridStartDate,
            gridEndDate: gridEndDate,
            isDangerous: task.isDangerous,
          })
          return (
            <div
              key={`WBS_task_${task.id}`}
              style={{
                display: "flex",
                position: "relative",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={CELL_WIDTH * dates.length}
                height={CELL_HEIGHT}
                version="1.1"
                className="Grid__task-bar"
                style={{
                  display: "flex",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <rect {...TaskBarRectProps} y="5" height={CELL_HEIGHT - 10} />
              </svg>
              {dates.map(({ year, month, date }, index) => {
                const isToday = today.getTime() === new Date(`${year}/${month}/${date}`).getTime()
                return (
                  <div
                    key={`WBS__${task.id}_date_${year}_${month}_${date}`}
                    style={{
                      borderLeft: index === 0 ? "none" : "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                      width: "30px",
                      height: "30px",
                      flex: "0 0 30px",
                      backgroundColor: isToday ? "rgba(232, 232, 72, .5)" : "#fff",
                    }}
                  ></div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WBS
