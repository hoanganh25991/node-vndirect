import { crawlingOverview } from "./overview"
import { crawlingShareholder } from "./shareholder"
import { crawlingBalanceSheet } from "./balanceSheet"
import { crawlingBusinessReport } from "./businessReport"
import { crawlingCashFlow } from "./cashFlow"

// `https://www.vndirect.com.vn/portal/tong-quan/${lwSC}.shtml`,
// `https://www.vndirect.com.vn/portal/co-dong-chinh/${lwSC}.shtml`,
// `https://www.vndirect.com.vn/portal/bang-can-doi-ke-toan/${lwSC}.shtml`,
// `https://www.vndirect.com.vn/portal/bao-cao-ket-qua-kinh-doanh/${lwSC}.shtml`,
// `https://www.vndirect.com.vn/portal/bao-cao-luu-chuyen-tien-te/${lwSC}.shtml`

/**
 *
 * @param getState
 * @param dispatch
 */
export const getInfo = (getState, dispatch) => async stockCode => {
  const lwSC = stockCode.toLowerCase()
  const [overview, shareholder, { balanceSheet }, { businessReport }, { cashFlow }] = await Promise.all([
    crawlingOverview(null, dispatch)(`https://www.vndirect.com.vn/portal/tong-quan/${lwSC}.shtml`),
    crawlingShareholder(null, dispatch)(`https://www.vndirect.com.vn/portal/co-dong-chinh/${lwSC}.shtml`),
    crawlingBalanceSheet(null, dispatch)(`https://www.vndirect.com.vn/portal/bang-can-doi-ke-toan/${lwSC}.shtml`),
    crawlingBusinessReport(null, dispatch)(
      `https://www.vndirect.com.vn/portal/bao-cao-ket-qua-kinh-doanh/${lwSC}.shtml`
    ),
    crawlingCashFlow(null, dispatch)(`https://www.vndirect.com.vn/portal/bao-cao-luu-chuyen-tien-te/${lwSC}.shtml`)
  ])

  return {
    code: stockCode,
    overview,
    shareholder,
    balanceSheet,
    businessReport,
    cashFlow
  }
}

export default getInfo
