import { crawlingBusinessReport } from "./businessReport"
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "../reducers/logReducers"
import { TinyPage } from "../utils/page/TinyPage"

// Setup store
const store = createStore(combineReducers({ logState: logReducers }))
LogToConsole(() => {
  const { logState } = store.getState()
  return logState
}, store)

const { dispatch } = store

// Stuff
const _ = console.log

// Start test
const TEST_CASE = "Crawling Balance Sheet"
let pass = true
;(async () => {
  const url = "https://www.vndirect.com.vn/portal/bao-cao-ket-qua-kinh-doanh/aam.shtml"
  try {
    const { businessReport } = await crawlingBusinessReport(null, dispatch)(url)
    _("RECHECK")
    _([...businessReport].shift())
    _([...businessReport].pop())

    pass = businessReport
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await TinyPage.closeBrowser()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
