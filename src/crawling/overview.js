import readDescription from "../utils/page/readDescription"
import {removeSymbolOnCharacter} from "../utils/removeSymbolOnCharacter";

const getDescription = (url) => {
  return [
    {
      title: `Go to url: ${url}`,
      goto: url
    },
    {
      title: `Expose remove symbol in characters`,
      exposeFunction: ["removeSymbol", removeSymbolOnCharacter]
    },
    {
      title: `Run evaluate`,
      evaluate: () => {
        const divContent = document.querySelector("div.content_left")
        const liArr = [...divContent.querySelectorAll("div.width255 li"), ...divContent.querySelectorAll("div.width190 li")]
        let data = {};
        let transVn = {};
        liArr.forEach(li => {
          const title = li.querySelector(":nth-child(1)").innerText
          const value = li.querySelector(":nth-child(2)").innerText
          const key   = window.removeSymbol(title)
          data = {...data, [key] : value}
          transVn = {...transVn, [key]: title}
        })

        return ({data, transVn})
      },
      storeReturnAsKey: "overview"
    }
  ]
}

/**
 * Crawling categories
 * @param getState
 * @param dispatch
 * @constructor
 */
export const crawlingOverview = (getState, dispatch) => async url => {
  dispatch({ type: "LOG", msg: `\x1b[36m<<< GET OVERVIEW >>>\x1b[0m` })

  const description = getDescription(url)
  const storeReturn = await readDescription(getState, dispatch)(description)
  console.log(storeReturn)
  // const {overview: {data, transVn}} = storeReturn
  // return {data, transVn}
  return storeReturn
}

export default crawlingOverview
