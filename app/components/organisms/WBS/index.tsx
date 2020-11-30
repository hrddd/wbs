import React, { useState } from "react"
import { StickyColumns, StickyColumnsProps } from "./StickyColumns"

const CELL_HEIGHT = 30
const CELL_WIDTH = 30

type TaskStatus = "未確定" | "着手前" | "着手中" | "対応済" | "完了"
const TASK_STATUS: readonly TaskStatus[] = ["未確定", "着手前", "着手中", "対応済", "完了"] as const

type Task = {
  id: number
  label: string
  startDate: Date
  endDate: Date
  md: number
  player: string
  status: TaskStatus
}
const TASK_PARAM_LABEL: Omit<
  {
    [key in keyof Task]: string
  },
  "id"
> = {
  label: "タスク",
  startDate: "開始日",
  endDate: "終了日",
  md: "MD",
  player: "担当者",
  status: "ステータス",
}

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
    const dateDummyFlg = index % 3 === 0
    const status = TASK_STATUS
    const taskData = {
      id: index,
      label: "タスク その" + index,
      startDate: dateDummyFlg ? fastStartDate : lateStartDate,
      endDate: new Date("2020/7/31"),
      md: 13,
      player: "WBS 太郎",
      status: status[index % 5],
    }
    // selector
    return {
      ...taskData,
      isDangerous: today.getTime() > taskData.startDate.getTime(),
    }
  })
  const taskFilterParams = [...tasks].reduce(
    (acc, task) => {
      Object.keys(task).forEach((key: keyof Task) => {
        if (key !== "status") {
          acc[key] = acc[key] ? [...acc[key], task[key]] : [task[key]]
        }
      })
      return acc
    },
    {
      status: TASK_STATUS,
    }
  )
  const [taskFilteringParams, setTaskFilteringParams] = useState({
    status: "",
  })
  const handleOnChange = (e) => {
    setTaskFilteringParams({
      ...taskFilteringParams,
      [e.target.name]: e.target.value,
    })
  }
  // TODO: orや以外など複数条件で探せるように
  const filteredTasks = tasks.filter((task) => {
    return Object.entries(taskFilteringParams).every(([key, value]) => {
      return task[key] === value || value === ""
    })
  })
  const TaskFilter = ({ handleOnChange, values, name, selectedValue }) => {
    return (
      <div>
        <select name={name} onBlur={handleOnChange}>
          <option value="" />
          {values.map((value) => {
            return (
              <option value={value} selected={selectedValue === value}>
                {value}
              </option>
            )
          })}
        </select>
      </div>
    )
  }

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
      label: year + "年",
      cellLength: dateTotalCount,
    })
  )
  const monthLabels: StickyColumnsProps["labels"] = months.map((data) => ({
    label: data.month.toString() + "月",
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
            {Object.keys(TASK_PARAM_LABEL).map((label) => {
              const width = Math.max(label.length * 30, 180) + "px"
              return (
                <div
                  style={{
                    width,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                  <TaskFilter
                    handleOnChange={handleOnChange}
                    values={taskFilterParams.status}
                    name="status"
                    selectedValue={taskFilteringParams.status}
                  />
                </div>
              )
            })}
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
        {filteredTasks.map((task) => (
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
        {filteredTasks.map((task) => {
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
