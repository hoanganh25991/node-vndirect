import { saveAtKey, db, closeApp } from "./saveAtKey"
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "../../reducers/logReducers"

const TEST_CASE = `Save At Key`
const _ = console.log
const store = createStore(combineReducers({ logState: logReducers }))
const { dispatch } = store
let pass = true
LogToConsole(() => store.getState().logState, store)
;(async () => {
  const mainBranch = "tmp"
  const key = "saveAtKey"
  const now = new Date().getTime()
  const msg = { name: "anh", timestamp: now }

  try {
    await saveAtKey(null, dispatch)(mainBranch, key)(msg)

    // describe({type: "LOG", msg: `Store keys: ${JSON.stringify(storeKeys, null, 2)}`})
    const refToObjAtKey = db.ref(`${mainBranch}/${key}`)
    const fbVal = await new Promise(resolve => {
      refToObjAtKey.once("value", function(snapshot) {
        resolve(snapshot.val())
      })
    })

    dispatch({ type: "LOG", msg: `Firebase val ${JSON.stringify(fbVal)}` })

    pass = pass && fbVal.timestamp === now
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await db.ref(`${mainBranch}/${key}`).remove()
    await closeApp()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
