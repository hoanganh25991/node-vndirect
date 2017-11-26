import readDescription from "../utils/page/readDescription"

const getDescription = url => {
  return [
    {
      title: `Go to url: ${url}`,
      goto: url
    },
    {
      title: `Wait selector`,
      waitFor: "#boardData tr"
    },
    {
      title: `Get data`,
      evaluate: () => {
        const trArr = [...document.querySelectorAll("#boardData tr")]
        const stockCodes = trArr.map(tr => tr.querySelectorAll("th")[0].innerText.trim())
        return stockCodes
      },
      storeReturnAsKey: "vn30",
      screenshot: true
    }
  ]
}

/**
 * Crawling categories
 * @param getState
 * @param dispatch
 * @constructor
 */
export const crawlingVn30 = (getState, dispatch) => async () => {
  dispatch({ type: "LOG", msg: `\x1b[36m<<< GET VN30 >>>\x1b[0m` })
  const url = "http://stockboard.sbsc.com.vn/apps/StockBoard/SBSC/VN30INDEX.html"
  const { vn30 } = await readDescription(getState, dispatch)(getDescription(url))
  return { vn30 }
}

export default crawlingVn30
