const admin = require("firebase-admin")
const { serviceAccount, databaseURL } = require("./firebase.config.json")
const thisApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL
  },
  "primitiveUpdateToFirebase"
)
export const db = thisApp.database()

const updateObjX = (getState, describe) => (mainBranch, objXBranch) => async primitive => {
  // Find if post exist
  const refToObjXBranch = db.ref(`${mainBranch}/${objXBranch}`)
  const key = refToObjXBranch.push().key
  describe({ type: "LOG", msg: `Saving store...` })
  describe({ type: "LOG", msg: `ObjX key: ${key}` })
  await db.ref(`${mainBranch}/${objXBranch}/${key}`).set(primitive)
  return key
}

/**
 * Save array of primitive value to firebase
 * @param getState
 * @param describe
 */
export const updatePrimitive = (getState, describe) => (mainBranch, objXBranch) => primitives => {
  return Promise.all(
    primitives.map(async primitive => {
      return await updateObjX(getState, describe)(mainBranch, objXBranch)(primitive)
    }, Promise.resolve())
  )
}

export const closeApp = async () => await thisApp.delete()

export default updatePrimitive
