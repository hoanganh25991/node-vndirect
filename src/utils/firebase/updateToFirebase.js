const admin = require("firebase-admin")
const { serviceAccount, databaseURL } = require("./firebase.config.json")
const thisApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL
  },
  "updateToFirebase"
)
export const db = thisApp.database()

const updateObjX = (getState, dispatch) => (mainBranch, objXBranch, objXIndexKey = "id") => async objX => {
  // Find if post exist
  const { [objXIndexKey]: id } = objX
  const refToObjXBranch = db.ref(`${mainBranch}/${objXBranch}`)
  const sameObjX = await new Promise(resolve => {
    refToObjXBranch
      .orderByChild(objXIndexKey)
      .equalTo(id)
      .limitToFirst(1)
      .once("value", function(snapshot) {
        resolve(snapshot.val())
      })
  })

  const objXKey = sameObjX ? Object.keys(sameObjX)[0] : refToObjXBranch.push().key
  // dispatch({ type: "LOG", msg: `Saving store...` })
  // dispatch({ type: "LOG", msg: `ObjX ${objXIndexKey} : ${id}` })
  // dispatch({ type: "LOG", msg: `ObjX key: ${objXKey}` })
  await db.ref(`${mainBranch}/${objXBranch}/${objXKey}`).update(objX)
}

/**
 * Save array of objectX to firebase
 * @param getState
 * @param dispatch
 */
export const updateObjs = (getState, dispatch) => (mainBranch, objXBranch, objXIndexKey) => objXs => {
  return objXs.reduce(async (carry, objX) => {
    await carry
    return updateObjX(getState, dispatch)(mainBranch, objXBranch, objXIndexKey)(objX)
  }, Promise.resolve())
}

export const closeApp = async () => await thisApp.delete()

export default updateObjs
