import React from "react"

export function Calendar() {
  const startDate = new Date(2021, 6, 6)
  const startMonth = startDate.getMonth()
  const week = ["日", "月", "火", "水", "木", "金", "土"]
  const monthes = new Array(13).fill(0).map((_item, index) => {
    const year = startMonth + index <= 12 ? startDate.getFullYear() : startDate.getFullYear() + 1
    const month = (startMonth + index) % 12
    const endDate = new Date(year, month, 0).getDate()
    return {
      year,
      month,
      startDate: index === 0 ? startDate.getDate() : 1,
      endDate: index === 12 ? startDate.getDate() - 1 : endDate,
      startDay: new Date(year, month - 1, 1).getDay(),
    }
  })
  const tasks = new Array(50).fill(0).map((_value, index) => "タスク その" + index)

  const dates = monthes
    .map(({ year, month, startDate, endDate, startDay }) => {
      return new Array(endDate - startDate + 1).fill(0).map((_item, index) => ({
        year,
        month,
        date: startDate + index,
        day: week[(startDay + index) % 6],
      }))
    })
    .reduce((acc, item) => [...acc, ...item], [])

  const years = monthes.reduce((acc, { year, month, startDate, endDate, startDay }) => {
    return {
      ...acc,
      [year]: {
        cellLength: (acc[year]?.cellLength || 0) + (endDate - startDate + 1),
      },
    }
  }, {} as { [key: string]: { cellLength: number } })

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
            key={`Calendar_task_name_${task}`}
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
        <div
          style={{
            display: "flex",
          }}
        >
          {Object.entries(years).map(([year, data], index) => {
            return (
              <div
                key={`Calendar_year_wrap_${year}`}
                style={{
                  display: "flex",
                }}
              >
                {new Array(data.cellLength).fill(0).map((_data, index) => {
                  const shouldDrawYear = index === 0
                  return (
                    <div
                      key={`Calendar_year_${year}_${index}`}
                      style={{
                        borderLeft: shouldDrawYear ? "1px solid #ccc" : "none",
                        position: shouldDrawYear ? "sticky" : "static",
                        display: "flex",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                        flex: "0 0 30px",
                        flexDirection: "column",
                        left: shouldDrawYear ? 0 : "auto",
                      }}
                    >
                      {shouldDrawYear ? year : ""}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div
          style={{
            display: "flex",
          }}
        >
          {dates.map(({ year, date, month }, index) => (
            <div key={`Calendar_month_${year}_${month}_${date}`}>
              <div
                style={{
                  borderLeft: index === 0 || date === 1 ? "1px solid #ccc" : "none",
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
                {index === 0 || date === 1 ? month : ""}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
          }}
        >
          {dates.map(({ year, date, day, month }) => (
            <div key={`Calendar_date_${year}_${month}_${date}`}>
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
            key={`Calendar_task_${task}`}
            style={{
              display: "flex",
            }}
          >
            {dates.map(({ year, month, date }) => (
              <div
                key={`Calendar_task_${task}_date_${year}_${month}_${date}`}
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

export default Calendar
