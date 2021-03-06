import readDescription from "../utils/page/readDescription"
import { removeSymbolOnCharacter } from "../utils/removeSymbolOnCharacter"

const getDescription = url => {
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
      evaluate: async () => {
        try {
          const divContent = document.querySelector("div.content_left")
          const liArr = [
            ...divContent.querySelectorAll("div.width255 li"),
            ...divContent.querySelectorAll("div.width190 li")
          ]

          let data = {}
          let transVn = {}

          const dataArr = await Promise.all(
            liArr.map(async li => {
              const title = li.querySelector(":nth-child(1)").innerText
              const value = li.querySelector(":nth-child(2)").innerText
              const key = await window.removeSymbol(title)
              return { key, title, value }
            })
          )

          dataArr.forEach(obj => {
            const { title, key, value } = obj
            data[key] = value
            transVn[key] = title
          })

          return { data, transVn }
        } catch (err) {
          return "HasErr"
        }
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

  const storeReturn = await readDescription(getState, dispatch)(getDescription(url))
  const { overview: { data, transVn } } = storeReturn
  return { data, transVn }
}

export default crawlingOverview
