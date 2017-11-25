export const parsePercent = str => +str.match(/([\w,.]+) %/)[1]
export const parseComma = str => +str.replace(/,/g, "")
