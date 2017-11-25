import primitiveUpdateToFirebase, {db, closeApp} from "./primitiveUpdateToFirebase"
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "../../reducers/logReducers"
;(async () => {
  const store = createStore(combineReducers({ logState: logReducers }))
  const getState = () => ({})
  const describe = store.dispatch
  const _updateToFirebase = primitiveUpdateToFirebase(getState, describe)

  LogToConsole(store)

  const TEST_CASE = `Update to firebase`
  const _ = console.log

  try {
    const mainBranch = "tmp"
    const objXBranch = "primitiveUpdateToFirebase"
    const now = new Date().getTime()
    const msg = [now]

    const storeKeys = await _updateToFirebase(mainBranch, objXBranch)(msg)

    // describe({type: "LOG", msg: `Store keys: ${JSON.stringify(storeKeys, null, 2)}`})
    const refToObjXBranch = db.ref(`${mainBranch}/${objXBranch}/${storeKeys}`)
    const fbVal = await new Promise(resolve => {
      refToObjXBranch.once("value", function(snapshot) {
        resolve(snapshot.val())
      })
    })

    describe({ type: "LOG", msg: `Firebase val: ${fbVal}` })

    // Firebase snapshot val as primitive: "156897145"

    // Self clean up
    await db.ref(`${mainBranch}/${objXBranch}/${storeKeys}`).remove()

    const pass = fbVal === now
    return pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  } catch (err) {
    _(err)
    return _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  } finally {
    // Clean up
    // await firebaseApp.delete()
    await closeApp()
  }
})()
