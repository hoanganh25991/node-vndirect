const admin = require("firebase-admin")
const { serviceAccount, databaseURL } = require("./firebase.config.json")
const thisApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL
  },
  "manual"
)
const _ = console.log
export const db = thisApp.database()
;(async () => {
  try {
    // Remove overview, overviewTransVn
    // await db.ref("nodeRemoteCentral").remove()
    // await db.ref("nodeRemoteCentral2").remove()
    // await db.ref("nodeFoodyStores").remove()
    // await db.ref("nodeTinyStock/overviewTransVn").remove()
    await db.ref("nodeTinyStock/stocks").once("value", snapshot => _(snapshot.val()))
  } catch (err) {
    _(err)
  } finally {
    await thisApp.delete()
  }
})()
