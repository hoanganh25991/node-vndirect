import { parseQuater } from "./parse"

const _ = console.log
const TEST_CASE = "Parse Quater"

const str = "Q4/2014"
const expectedTimestamp = 1412096400
const quaterTs = parseQuater(str)

_("RECHECK", quaterTs)
const pass = quaterTs === expectedTimestamp
pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
