import {crawlingOverview} from "./overview";
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "../reducers/logReducers"
import {TinyPage} from "../utils/page/TinyPage";


// Setup store
const store = createStore(combineReducers({ logState: logReducers }))
LogToConsole(() => {
  const {logState} = store.getState()
  return logState
}, store)

const {dispatch} = store

// Stuff
const _ = console.log

// Start test
const TEST_CASE = "Crawling Overview";

(async () => {
  const url = "https://www.vndirect.com.vn/portal/tong-quan/aam.shtml"
  try{
    const xxx = await crawlingOverview(null, dispatch)(url)
    console.log(xxx)
  }catch(err){
    _(err)
  }finally {
    await TinyPage.closeBrowser()
  }
})()