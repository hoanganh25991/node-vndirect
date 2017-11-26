import readDescription from "../utils/page/readDescription"
const _ = console.log

const getDescriptionOneYear = (url, year) => {
  return [
    {
      title: `Select year`,
      evaluate: async () => {
        const year = await window.year()

        // Choose the quater started at
        // The quater 4
        const q4 = document.querySelector("#fCashFlow_fiscalQuarter > option:nth-child(5)")
        q4.setAttribute("selected", "true")

        // Choose how many quaters after the started one
        // Choose 4 ( 4 quaters as 1 year)
        const list4 = document.querySelector("#fCashFlow_numberTerm > option:nth-child(4)")
        list4.setAttribute("selected", "true")

        // Pick up the year we want
        // Reset selected first
        // Find out option we want, then select it
        const yearOpts = [...document.querySelectorAll("#fCashFlow_fiscalYear option")]
        yearOpts.forEach(option => option.removeAttribute("selected"))
        const yearOpt = yearOpts.filter(option => option.innerText.trim() === `${year}`)[0]
        yearOpt && yearOpt.setAttribute("selected", "true")

        // Run filter
        const runBtn = document.querySelector("div.si_tab_new input")
        runBtn.click()
      }
    },
    {
      title: `Wait for navigation`,
      waitForNavigation: { timeout: 200000 }
    },
    {
      title: `Get data ${year}`,
      evaluate: async () => {
        // Dependencies method
        // Inject by code into sandbox
        // Promise run take time throught the bridge
        // Not good to pass it here, but FAST executed
        const parseComma = str => +str.replace(/,/g, "")
        const removeSymbol = str => {
          const mapNonUnicodeToUnicode = {
            a: "á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ",
            d: "đ",
            e: "é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ",
            i: "í|ì|ỉ|ĩ|ị",
            o: "ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ",
            u: "ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự",
            y: "ý|ỳ|ỷ|ỹ|ỵ"
          }

          const nonUnicodeStr = Object.keys(mapNonUnicodeToUnicode).reduce((carry, nonUnicode) => {
            let unicode = mapNonUnicodeToUnicode[nonUnicode]
            carry = carry.replace(new RegExp(unicode, "g"), nonUnicode)
            return carry
          }, str)

          return nonUnicodeStr.replace(/\s/g, "")
        }
        const parseQuater = (str, tz = 7) => {
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

        // MAIN CODE
        // Store main shareholder
        // let transVn = {}

        const trOArr = [
          ...document.querySelectorAll(
            "#fCashFlow > div.content_small > div > div.table_Market.clearfix > table > tbody > tr > td > table > tbody tr"
          )
        ]

        const trTitle = trOArr[0]
        const trArr = trOArr.filter((i, index) => index > 0)

        // Find out header
        const headerThs = [...trTitle.querySelectorAll("td")]
        const headerOArr = headerThs.map((th, index) => {
          const title = th.innerText.trim()
          const key = removeSymbol(title)
          return { index, key, title }
        })

        // Remove the first empty
        const headerArr = headerOArr.filter(header => {
          const { title } = header
          return title !== ""
        })

        const data = []
        headerArr.forEach(header => {
          const { index, title } = header
          const record = {}

          // Inject the timestamp for the quater
          record["name"] = title
          record["timestamp"] = parseQuater(title)

          trArr.forEach(tr => {
            const tds = [...tr.querySelectorAll("td")]
            const title = tds[0].innerText.trim()
            const key = removeSymbol(title)
            record[key] = parseComma(tds[index].innerText.trim())
          })

          data.push(record)
        })

        return data
      },
      // screenshot: { image: `balance-sheet-${year}` },
      storeReturnAsKey: `${year}`
    }
  ]
}

const getDecriptionAllYear = (url, years) => {
  const cpYears = [...years]
  return [
    {
      title: `Find out cash flow for: ${years.join("|")}`,
      actions: [
        {
          title: `Go to url: ${url}`,
          goto: url
        },
        {
          title: `Expose year`,
          exposeFunction: [
            "year",
            () => {
              const curYr = cpYears.shift()
              _(`  \\__ ${curYr}`)
              return curYr
            }
          ]
        },
        ...years.map(year => ({
          title: `Find for ${year}`,
          actions: getDescriptionOneYear(url, year)
        }))
      ]
    }
  ]
}

const shouldCrawlingYears = [2017, 2016, 2015, 2014, 2013]
// const shouldCrawlingYears = [2014, 2013]

/**
 * Crawling categories
 * @param getState
 * @param dispatch
 * @constructor
 */
export const crawlingCashFlow = (getState, dispatch) => async (url, years = shouldCrawlingYears) => {
  dispatch({ type: "LOG", msg: `\x1b[36m<<< GET CASH FLOW >>>\x1b[0m` })
  const storeReturn = await readDescription(getState, dispatch)(getDecriptionAllYear(url, years))
  const dataArr = Object.values(storeReturn).reduce((carry, chunkArr) => [...carry, ...chunkArr], [])
  return { cashFlow: dataArr }
}

export default crawlingCashFlow
