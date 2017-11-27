import { crawlingVn30 } from "./crawling/vn30"
import { getInfo as getStockInfo } from "./crawling/stockCodeInfo"
import { save as saveToFirebase, closeApp } from "./firebase/save"
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "./reducers/logReducers"
import { TinyPage } from "./utils/page/TinyPage"

// Setup store
const store = createStore(combineReducers({ logState: logReducers }))
const { dispatch } = store
const _ = console.log
const TEST_CASE = "Crawling&Save"
let pass = true

// Watch Log
LogToConsole(() => store.getState().logState, store)

const saveStock = (getState, dispatch) => async stockCode => {
  _(`Run on stockCode: ${stockCode}`)
  const stockInfo = await getStockInfo(getState, dispatch)(stockCode)
  await saveToFirebase(getState, dispatch)(stockInfo)
}
;(async () => {
  try {
    const { vn30 } = await crawlingVn30(null, dispatch)()
    // vn30.splice(2) // Throttle for test
    await vn30.reduce((carry, stockCode) => carry.then(() => saveStock(null, dispatch)(stockCode)), Promise.resolve())
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await TinyPage.closeBrowser()
    await closeApp()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
