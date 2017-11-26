import { crawlingVn30 } from "./vn30"
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "../reducers/logReducers"
import { TinyPage } from "../utils/page/TinyPage"

const TEST_CASE = "Crawling VN30"
let pass = true

const store = createStore(combineReducers({ logState: logReducers }))
const { dispatch } = store
const _ = console.log

LogToConsole(() => store.getState().logState, store)
;(async () => {
  try {
    const { vn30 } = await crawlingVn30(null, dispatch)()
    _("RECHECK")
    _(vn30)

    pass = vn30 && vn30.length === 30
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await TinyPage.closeBrowser()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
