import { saveAtKey, closeApp as closeAppSA } from "../utils/firebase/saveAtKey"
import { updateObjs, closeApp as closeAppUO } from "../utils/firebase/updateToFirebase"
import { mainBranch, stockBranch } from "./save.config.json"
const _ = console.log

export const saveOverview = (getState, dispatch) => async (stockCode, overview) => {
  const { data, transVn } = overview
  const dataKey = `${stockBranch}/${stockCode}/overview`
  const transVnKey = `${stockBranch}/${stockCode}/overviewTransVn`
  await saveAtKey(getState, dispatch)(mainBranch, dataKey)(data)
  await saveAtKey(getState, dispatch)(mainBranch, transVnKey)(transVn)
}

export const saveShareholderStructure = (getState, dispatch) => async (stockCode, shareholderStructure) => {
  const { data, transVn } = shareholderStructure
  const dataKey = `${stockBranch}/${stockCode}/shareholderStructure`
  const transVnKey = `${stockBranch}/${stockCode}/shareholderStructureTransVn`
  await saveAtKey(getState, dispatch)(mainBranch, dataKey)(data)
  await saveAtKey(getState, dispatch)(mainBranch, transVnKey)(transVn)
}

export const saveMainShareholder = (getState, dispatch) => async (stockCode, mainShareholder) => {
  const { data, transVn } = mainShareholder
  const dataKey = `${stockBranch}/${stockCode}/mainShareholder`
  const transVnKey = `${stockBranch}/${stockCode}/mainShareholderTransVn`
  await updateObjs(getState, dispatch)(mainBranch, dataKey, "Hovaten")(data)
  await saveAtKey(getState, dispatch)(mainBranch, transVnKey)(transVn)
}

export const saveFinancailReport = (getState, dispatch) => async (
  stockCode,
  report,
  reportName = "reportName",
  dataId = "timestamp"
) => {
  const { data, hierachyShape, transVn } = report
  const dataKey = `${stockBranch}/${stockCode}/${reportName}`
  const transVnKey = `${stockBranch}/${stockCode}/${reportName}TransVn`
  const hierachyKey = `${reportName}HierachyShape`
  await updateObjs(getState, dispatch)(mainBranch, dataKey, dataId)(data)
  await saveAtKey(getState, dispatch)(mainBranch, transVnKey)(transVn)
  await saveAtKey(getState, dispatch)(mainBranch, `${stockBranch}/${stockCode}`)({ [hierachyKey]: hierachyShape })
}

/**
 *
 * @param getState
 * @param dispatch
 */
export const save = (getState, dispatch) => async stockInfo => {
  const { code, overview, shareholderStructure, mainShareholder, balanceSheet, businessReport, cashFlow } = stockInfo
  dispatch({ type: "LOG", msg: `\x1b[36m<<< SAVE TO FIREBASE - STOCKCODE ${code} >>>\x1b[0m` })
  await saveOverview(getState, dispatch)(code, overview)
  await saveShareholderStructure(getState, dispatch)(code, shareholderStructure)
  await saveMainShareholder(getState, dispatch)(code, mainShareholder)
  await saveFinancailReport(getState, dispatch)(code, balanceSheet, "balancesheet")
  await saveFinancailReport(getState, dispatch)(code, businessReport, "businessReport")
  await saveFinancailReport(getState, dispatch)(code, cashFlow, "cashFlow")
}

export const closeApp = async () => {
  await closeAppSA()
  await closeAppUO()
}
