import { crawlingCashFlow } from "./cashFlow"
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
const TEST_CASE = "Crawling Cash Flow"
let pass = true
;(async () => {
  const url = "https://www.vndirect.com.vn/portal/bao-cao-luu-chuyen-tien-te/aam.shtml"
  try {
    const { cashFlow, hierachyShape, transVn } = await crawlingCashFlow(null, dispatch)(url)
    _("RECHECK")
    _([...cashFlow].shift())
    _([...cashFlow].pop())

    const rightRoot = hierachyShape[0].key === "TỔNGDOANHTHUHOẠTĐỘNGKINHDOANH"
    pass = cashFlow && hierachyShape && transVn && rightRoot
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await TinyPage.closeBrowser()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
