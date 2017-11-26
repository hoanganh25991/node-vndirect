import { crawlingShareholder } from "./shareholder"
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
const TEST_CASE = "Crawling Shareholder"
let pass = true
;(async () => {
  const url = "https://www.vndirect.com.vn/portal/co-dong-chinh/aam.shtml"
  try {
    const { structure, main } = await crawlingShareholder(null, dispatch)(url)
    _("RECHECK")
    _(structure)
    _(main)

    pass = structure && main
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await TinyPage.closeBrowser()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
