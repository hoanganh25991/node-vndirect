import primitiveUpdateToFirebase, { db, closeApp } from "./primitiveUpdateToFirebase"
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "../../reducers/logReducers"

const TEST_CASE = `Update to firebase`
const _ = console.log
const store = createStore(combineReducers({ logState: logReducers }))
const describe = store.dispatch
let pass = true

LogToConsole(() => store.getState().logState, store)
;(async () => {
  const mainBranch = "tmp"
  const objXBranch = "updatePrimitive"
  const now = new Date().getTime()
  const msg = [now]

  try {
    const storeKeys = await primitiveUpdateToFirebase(null, describe)(mainBranch, objXBranch)(msg)

    // describe({type: "LOG", msg: `Store keys: ${JSON.stringify(storeKeys, null, 2)}`})
    const refToObjXBranch = db.ref(`${mainBranch}/${objXBranch}/${storeKeys}`)
    const fbVal = await new Promise(resolve => {
      refToObjXBranch.once("value", function(snapshot) {
        resolve(snapshot.val())
      })
    })

    // Firebase snapshot val as primitive: "156897145"
    // Self clean up
    describe({ type: "LOG", msg: `Firebase val: ${fbVal}` })
    await db.ref(`${mainBranch}/${objXBranch}/${storeKeys}`).remove()

    pass = fbVal === now
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await closeApp()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
