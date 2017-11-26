import { buildHierachy } from "./buildHierachy"
import testArr from "./buildHierachy.test.json"
import testArr2 from "./buildHierachy2.test.json"
import testArr3 from "./buildHierachy3.test.json"

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
const passT1 = check(shape)
passT1 ? _("Pass case: common") : _("Fail case: common")
pass = pass && passT1

// Test case 2
const check2 = shape => {
  const expectdKey = "Thunhapthuantuhoatdongdichvu"
  const item = shape[5]
  return expectdKey === item.key
}

const shape2 = buildHierachy(testArr2)
const passT2 = check2(shape2)
passT2 ? _("Pass case: Root parent not start at 0") : _("Fail case: Root parent not start at 0")
pass = pass && passT2

// Test case 3
const check3 = shape => {
  const expectdKey = "Chungkhoankinhdoanh"
  const item = shape[0].subs[3]
  return expectdKey === item.key
}

const shape3 = buildHierachy(testArr3)
const passT3 = check3(shape3)
passT3 ? _("Pass case: cant find nearest parent") : _("Fail case: cant find nearest parent")
pass = pass && passT3

pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
