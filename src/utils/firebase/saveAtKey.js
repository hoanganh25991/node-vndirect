const admin = require("firebase-admin")
const { serviceAccount, databaseURL } = require("./firebase.config.json")
const thisApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL
  },
  "saveAtKey"
)
export const db = thisApp.database()

export const saveAtKey = (getState, describe) => (mainBranch, key) => async data => {
  const refToKey = db.ref(`${mainBranch}/${key}`)
  await refToKey.update(data)
}

export default saveAtKey

export const closeApp = async () => await thisApp.delete()
