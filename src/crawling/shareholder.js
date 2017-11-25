import readDescription from "../utils/page/readDescription"
import { removeSymbolOnCharacter } from "../utils/removeSymbolOnCharacter"
// import {parsePercent, parseComma} from "../utils/parse";

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
        const parsePercent = str => +str.match(/([\w,.]+) %/)[1]
        const parseComma = str => +str.replace(/,/g, "")

        try {
          const liArr = [...document.querySelectorAll("ul.box_cocau_codong li")]

          // Store shareholder structure
          let data = {}
          let transVn = {}

          const dataArr = await Promise.all(
            liArr.map(async li => {
              const title = li.querySelector(":nth-child(1)").innerText
              const value = parsePercent(li.querySelector(":nth-child(2)").innerText)
              const key = await window.removeSymbol(title)
              return { key, title, value }
            })
          )

          dataArr.forEach(obj => {
            const { title, key, value } = obj
            data[key] = value
            transVn[key] = title
          })

          // Store main shareholder
          let transVn2 = {}

          const trArr = [...document.querySelectorAll("div.box_codong_big tr")]
          const trTitle = trArr.shift()

          // Find out header
          const headerThs = [...trTitle.querySelectorAll("th")]
          const headerArr = await Promise.all(
            headerThs.map(async (th, index) => {
              const title = th.innerText
              const key = await window.removeSymbol(title)
              return { index, key, title }
            })
          )

          // Translate header as index > key
          const headers = {}
          headerArr.forEach(header => {
            const { index, key, title } = header
            headers[index] = { key, title }
            transVn2[key] = title
          })

          const data2 = trArr.map(tr => {
            const tds = [...tr.querySelectorAll("td")]
            const record = {}
            tds.forEach((td, index) => {
              const key = headers[index].key
              const text = td.innerText
              let value
              switch (index) {
                default: {
                  value = text
                  break
                }
                case 2: {
                  value = parseComma(text)
                  break
                }
                case 3: {
                  value = parsePercent(text)
                  break
                }
              }

              record[key] = value
            })

            return record
          })

          return { structure: { data, transVn }, main: { data: data2, transVn: transVn2 } }
        } catch (err) {
          return "HasErr"
        }
      },
      storeReturnAsKey: "shareholder"
    }
  ]
}

/**
 * Crawling categories
 * @param getState
 * @param dispatch
 * @constructor
 */
export const crawlingShareholder = (getState, dispatch) => async url => {
  dispatch({ type: "LOG", msg: `\x1b[36m<<< GET SHAREHOLDER >>>\x1b[0m` })

  const storeReturn = await readDescription(getState, dispatch)(getDescription(url))
  const { shareholder: { structure, main } } = storeReturn
  return { structure, main }
}

export default crawlingShareholder
