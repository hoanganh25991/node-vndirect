import { parseQuater } from "./parse"

const _ = console.log
const TEST_CASE = "Parse Quater"
let pass = true

// Test case 1
const str = "Q4/2014"
const expectedTs = 1412096400
const quaterTs = parseQuater(str)

_("RECHECK", quaterTs)
pass = pass && quaterTs === expectedTs

// Test case 2
// When quater as 2 > month only 1 digit > err
const str2 = "Q2/2017"
const expectedTs2 = 1490979600
const quaterTs2 = parseQuater(str2)

_("RECHECK", quaterTs2)
pass = pass && quaterTs2 === expectedTs2

_(`\x1b[31m Please manually UPATE page evaluate sandbox use this parse func \x1b[0m`)
pass ? _(`\x1b[42m [PASS] \x1b[0m ${TEST_CASE}`) : _(`\x1b[41m [FAIL] \x1b[0m ${TEST_CASE}`)
