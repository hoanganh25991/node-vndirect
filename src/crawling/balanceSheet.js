import readDescription from "../utils/page/readDescription"
import { removeSymbolOnCharacter } from "../utils/removeSymbolOnCharacter"

const getDescriptionOneYear = (url, year) => {
  return [
    {
      title: `Go to url: ${url}`,
      goto: url
    },
    {
      title: `Expose year ${year}`,
      exposeFunction: ["year", () => year]
    },
    {
      title: `Select year`,
      evaluate: async () => {
        const year = await window.year()

        // Choose the quater started at
        // The quater 4
        const q4 = document.querySelector("#fBalanceSheet select:nth-child(2) > option:nth-child(5)")
        q4.setAttribute("selected", "true")

        // Choose how many quaters after the started one
        // Choose 4 ( 4 quaters as 1 year)
        const list4 = document.querySelector("#fBalanceSheet select:nth-child(5) > option:nth-child(4)")
        list4.setAttribute("selected", "true")

        // Pick up the year we want
        const yearOpts = [...document.querySelectorAll("#fBalanceSheet select:nth-child(3) option")]
        const yearOpt = yearOpts.filter(option => option.innerText.trim() === `${year}`)[0]
        yearOpt.setAttribute("selected", "true")

        // Run filter
        const runBtn = document.querySelector("div.si_tab_new input")
        runBtn.click()
      }
    },
    {
      title: `Wait for navigation`,
      waitForNavigation: { timeout: 3000 }
    },
    {
      title: `Expose remove symbol in characters`,
      exposeFunction: ["removeSymbol", removeSymbolOnCharacter]
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
          const qX = +matcheds[1]
          const yrX = matcheds[2]
          // 2008-09-15T15:53:00+0500
          const month = (qX - 1) * 3 + 1
          // I want the default timezone is Asia/Ho_Chi_Minh
          const tzStr = `${tz}`.length === 2 ? `${tz}` : `0${tz}`
          const mSr = `${month}`.length === 2 ? `${month}` : `0${month}`

          const date = new Date(`${yrX}-${mSr}-01T00:00:00+${tzStr}00`)

          return Math.floor(date.getTime() / 1000)
        }

        // MAIN CODE
        // Store main shareholder
        // let transVn = {}

        const trOArr = [
          ...document.querySelectorAll(
            "#fBalanceSheet > div.content_small > div > div.table_Market.clearfix > table > tbody > tr > td > table > tbody > tr"
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

        const data = {}
        headerArr.forEach(header => {
          const { index, key, title } = header
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

          data[key] = record
        })

        return data
      },
      screenshot: true,
      storeReturnAsKey: `Year${year}`
    }
  ]
}

const getDecriptionAllYear = (url, years) => {
  return [
    {
      title: `Find out balance sheet for these years: ${years.join("|")}`,
      actions: years.map(year => ({
        title: `Find for ${year}`,
        actions: getDescriptionOneYear(url, year)
      }))
    }
  ]
}

const shouldCrawlingYears = [2017, 2016, 2015, 2014, 2013]

/**
 * Crawling categories
 * @param getState
 * @param dispatch
 * @constructor
 */
export const crawlingBalanceSheet = (getState, dispatch) => async (url, years = shouldCrawlingYears) => {
  dispatch({ type: "LOG", msg: `\x1b[36m<<< GET BALANCE SHEET >>>\x1b[0m` })

  const storeReturn = await readDescription(getState, dispatch)(getDecriptionAllYear(url, years))
  return { balanceSheet: storeReturn }
}

export default crawlingBalanceSheet