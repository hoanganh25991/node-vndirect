const _ = console.log

export const buildHierachy = arr => {
  const root = { subs: [] }
  const arrRootLv = arr[0].lv
  const parrentSheet = { root }
  arr.forEach(item => {
    const curItem = { ...item }
    const { lv: itemLv } = curItem
    const lv = itemLv - arrRootLv
    // Find his parent
    // _("parrentSheet, pLv", parrentSheet, pLv)
    let curLv = lv
    let pItem = null
    do {
      const pLv = curLv > 0 ? curLv - 1 : "root"
      pItem = parrentSheet[pLv]
      curLv--
    } while (!pItem)

    const { subs = [] } = pItem
    // Add him into his parent
    subs.push(curItem)
    pItem.subs = subs
    // Add him into parentSheet
    parrentSheet[lv] = curItem
  })

  const { root: { subs: shape } } = parrentSheet
  return shape
}

export default buildHierachy
