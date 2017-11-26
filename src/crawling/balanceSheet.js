import readDescription from "../utils/page/readDescription"
import { removeSymbolOnCharacter } from "../utils/removeSymbolOnCharacter"

const getDescription = (url, year) => {
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
        const q4 = document.querySelector("#fBalanceSheet select:nth-child(2) > option:nth-child(5)")
        q4.setAttribute("selected", "true")

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
        // Store main shareholder
        let transVn = {}

        const trArr = [
          ...document.querySelectorAll(
            "#fBalanceSheet > div.content_small > div > div.table_Market.clearfix > table > tbody > tr > td > table > tbody > tr"
          )
        ]
        const trTitle = trArr.shift()

        // Find out header
        const headerThs = [...trTitle.querySelectorAll("td")]
        const headerArr = headerThs.map((th, index) => {
          const title = th.innerText
          const key = removeSymbol(title)
          return { index, key, title }
        })

        // Remove the first empty
        headerArr.shift()

        headerArr.forEach(header => {
          const { key, title } = header
          transVn[key] = title
        })

        const data = {}
        headerArr.forEach(header => {
          const { index, key } = header
          const record = {}

          trArr.forEach(tr => {
            const tds = [...tr.querySelectorAll("td")]
            const title = tds[0].innerText.trim()
            const key = removeSymbol(title)
            record[key] = parseComma(tds[index].innerText.trim())
            transVn[key] = title
          })

          data[key] = record
        })

        return { data, transVn }
      },
      screenshot: true,
      storeReturnAsKey: "balanceSheet"
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

  const storeReturn = await readDescription(getState, dispatch)(getDescription(url, 2016))
  const { balanceSheet: { data, transVn } } = storeReturn
  return { data, transVn }
}

export default crawlingBalanceSheet
