import { crawlingShareholderStructure } from "./shareholderStructure"
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
const TEST_CASE = "Crawling Ownership"
let pass = true
;(async () => {
  const url = "https://www.vndirect.com.vn/portal/co-dong-chinh/aam.shtml"
  try {
    const { data, transVn } = await crawlingShareholderStructure(null, dispatch)(url)
    _("RECHECK", data, transVn)
    pass = data && transVn
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await TinyPage.closeBrowser()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
