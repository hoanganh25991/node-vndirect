import { buildHierachy } from "./buildHierachy"
import testArr from "./buildHierachy.test.json"
import testArr2 from "./buildHierachy2.test.json"

const TEST_CASE = "Build Hierachy"
const _ = console.log
let pass = true

// Test case 1
const check = shape => {
  const expectdKey = "Cackhoanphaithunganhan"
  const item = shape[0].subs[0].subs[2]
  return expectdKey === item.key
}

const shape = buildHierachy(testArr)
pass = pass && check(shape)

// Test case 2
const check2 = shape => {
  const expectdKey = "Thunhapthuantuhoatdongdichvu"
  const item = shape[5]
  return expectdKey === item.key
}

const shape2 = buildHierachy(testArr2)
pass = pass && check2(shape2)

pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
