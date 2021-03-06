const _ = console.log

export const parsePercent = str => +str.match(/([\w,.]+) %/)[1]
export const parseComma = str => +str.replace(/,/g, "")
export const parseQuater = (str, tz = 7) => {
  const matcheds = str.match(/(\d+)\/(\d+)/)
  // Get out info
  const qX = +matcheds[1]
  const yrX = matcheds[2]
  const month = (qX - 1) * 3 + 1
  // I want the default timezone as Asia/Ho_Chi_Minh
  const tzStr = `${tz}`.length === 2 ? `${tz}` : `0${tz}`
  const mSr = `${month}`.length === 2 ? `${month}` : `0${month}`
  // sample dateStr: 2008-09-15T15:53:00+0500
  const date = new Date(`${yrX}-${mSr}-01T00:00:00+${tzStr}00`)
  // timestamp
  return Math.floor(date.getTime() / 1000)
}
export const parseLevel = str => +str.match(/lv(\d+)/)[1]
