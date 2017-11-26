const _ = console.log

export const buildHierachy = arr => {
  const root = { subs: [] }
  const parrentSheet = { root }
  arr.forEach(item => {
    const curItem = { ...item }
    const { lv } = curItem

    // Find his parent
    const pLv = lv > 0 ? lv - 1 : "root"
    const pItem = parrentSheet[pLv]
    const { subs = [] } = pItem
    subs.push(curItem)
    pItem.subs = subs

    // Add him into his parent
    // Add him into parentSheet
    parrentSheet[lv] = curItem
  })

  const { root: { subs: shape } } = parrentSheet
  return shape
}

export default buildHierachy
