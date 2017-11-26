import { buildHierachy } from "./buildHierachy"
import testArr from "./buildHierachy.test.json"

const TEST_CASE = "Build Hierachy"
const _ = console.log
let pass = true

const check = shape => {
  const expectdKey = "Cackhoanphaithunganhan"
  const item = shape[0].subs[0].subs[2]
  return expectdKey === item.key
}

const shape = buildHierachy(testArr)
pass = check(shape)

pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
