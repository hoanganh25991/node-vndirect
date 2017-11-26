import { crawlingBalanceSheet } from "./balanceSheet"
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
  const url = "https://www.vndirect.com.vn/portal/bang-can-doi-ke-toan/aam.shtml"
  try {
    const { data, hierachyShape, transVn } = await crawlingBalanceSheet(null, dispatch)(url)
    _("RECHECK")
    _([...data].shift())
    _([...data].pop())

    const rightRoot = hierachyShape[0].key === "TỔNGCỘNGTÀISẢN"
    pass = data && hierachyShape && transVn && rightRoot
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await TinyPage.closeBrowser()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
