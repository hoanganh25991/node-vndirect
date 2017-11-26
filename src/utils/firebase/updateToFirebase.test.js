import updateToFirebase, { db, closeApp } from "./updateToFirebase"
import { combineReducers, createStore } from "redux"
import { logReducers, LogToConsole } from "../../reducers/logReducers"

const TEST_CASE = `Update to firebase`
const _ = console.log
const store = createStore(combineReducers({ logState: logReducers }))
const { dispatch } = store
let pass = true

LogToConsole(() => store.getState().logState, store)

////
;(async () => {
  const mainBranch = "tmp"
  const objXBranch = "updateToFirebase"
  const objXIndexKey = "title"
  const objXTitle = new Date().getTime()
  const objXs = [
    {
      title: objXTitle,
      content: "This is the test obj"
    }
  ]

  try {
    await updateToFirebase(null, dispatch)(mainBranch, objXBranch, objXIndexKey)(objXs)

    const refToObjXBranch = db.ref(`${mainBranch}/${objXBranch}`)
    const objXWithKey = await new Promise(resolve => {
      refToObjXBranch
        .orderByChild(objXIndexKey)
        .equalTo(objXTitle)
        .limitToFirst(1)
        .once("value", function(snapshot) {
          resolve(snapshot.val())
        })
    })

    // Firebase return snapshot as obj shape:
    // {
    //   "KWIJHUHJK": {
    //     title: "xxx",
    //     content: "xxx"
    //   }
    // }
    // Self clean up
    await db.ref(`${mainBranch}/${objXBranch}/${Object.keys(objXWithKey)[0]}`).remove()

    pass = Object.values(objXWithKey)[0].title === objXTitle
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await closeApp()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
