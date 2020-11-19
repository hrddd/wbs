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
  const tasks = new Array(50).fill(0).map((index) => index)

  const days = monthes
    .map(({ year, month, startDate, endDate, startDay }) => {
      return new Array(endDate - startDate + 1).fill(0).map((_item, index) => ({
        year,
        month,
        day: startDate + index,
        week: week[(startDay + index) % 6],
      }))
    })
    .reduce((acc, item) => [...acc, ...item], [])

  return (
    <div
      style={{
        width: "1000px",
        overflowX: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        {days.map(({ year, day, month }, index) => (
          <div key={`Calendar_month_${year}_${month}_${day}`}>
            <div
              style={{
                borderLeft: index === 0 || (month === 1 && day === 1) ? "1px solid #ccc" : "none",
                borderBottom: "1px solid #ccc",
                display: "flex",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                flex: "0 0 30px",
                flexDirection: "column",
              }}
            >
              {index === 0 || (month === 1 && day === 1) ? year : ""}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        {days.map(({ year, day, month }, index) => (
          <div key={`Calendar_month_${year}_${month}_${day}`}>
            <div
              style={{
                borderLeft: index === 0 || day === 1 ? "1px solid #ccc" : "none",
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
              {index === 0 || day === 1 ? month : ""}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        {days.map(({ year, day, week, month }) => (
          <div key={`Calendar_day_${year}_${month}_${day}`}>
            <div
              style={{
                borderLeft: "1px solid #ccc",
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
              {day}
            </div>
            <div
              style={{
                borderLeft: "1px solid #ccc",
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
              {week}
            </div>
          </div>
        ))}
      </div>
      {tasks.map((task) => (
        <div
          style={{
            display: "flex",
          }}
        >
          {days.map(({ year, month, day }) => (
            <div
              key={`Calendar_cell_${year}_${month}_${day}_${task}`}
              style={{
                borderLeft: "1px solid #ccc",
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
  )
}

export default Calendar
