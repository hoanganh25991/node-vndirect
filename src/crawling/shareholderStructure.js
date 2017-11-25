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
          const liArr = [...document.querySelectorAll("ul.box_cocau_codong li")]

          let data = {}
          let transVn = {}

          const dataArr = await Promise.all(
            liArr.map(async li => {
              const title = li.querySelector(":nth-child(1)").innerText
              const value = +li.querySelector(":nth-child(2)").innerText.match(/([\w,.]+) %/)[1]
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
      storeReturnAsKey: "shareholderStructure"
    }
  ]
}

/**
 * Crawling categories
 * @param getState
 * @param dispatch
 * @constructor
 */
export const crawlingShareholderStructure = (getState, dispatch) => async url => {
  dispatch({ type: "LOG", msg: `\x1b[36m<<< GET OWNERSHIP >>>\x1b[0m` })

  const storeReturn = await readDescription(getState, dispatch)(getDescription(url))
  const { shareholderStructure: { data, transVn } } = storeReturn
  return { data, transVn }
}

export default crawlingShareholderStructure
