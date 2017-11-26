import { getInfo } from "./stockCodeInfo"
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "../reducers/logReducers"
import { TinyPage } from "../utils/page/TinyPage"

// Setup store
// Test case
const store = createStore(combineReducers({ logState: logReducers }))
const { dispatch } = store
const _ = console.log
const TEST_CASE = "Stock Info"
let pass = true

// Watch Log
LogToConsole(() => store.getState().logState, store)
;(async () => {
  const stockCode = "AAA"
  try {
    const stockInfo = await getInfo(null, dispatch)(stockCode)
    _("RECHECK")
    _(stockInfo["overview"])

    pass = stockInfo
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await TinyPage.closeBrowser()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
