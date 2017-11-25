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
      title: `Get data ${year}`,
      evaluate: () => {
        return {
          data: document.querySelector(
            "#fBalanceSheet > div.content_small > div > div.si_tab_new > div > h2 > select:nth-child(3)"
          ).value
        }
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
