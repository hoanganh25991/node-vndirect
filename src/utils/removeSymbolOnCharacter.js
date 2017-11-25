/**
 * This function helps to build text content of order
 * Which will be sent to bill printer
 *
 * The character width is hard coded as 40 characters
 * (on Epson Tm-U220)
 *
 * @param str
 * @returns {string}
 */
export const removeSymbolOnCharacter = str => {
  const mapNonUnicodeToUnicode = {
    a: "á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ",
    d: "đ",
    e: "é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ",
    i: "í|ì|ỉ|ĩ|ị",
    o: "ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ",
    u: "ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự",
    y: "ý|ỳ|ỷ|ỹ|ỵ"
  }

  const nonUnicodeStr = Object.keys(mapNonUnicodeToUnicode).reduce((carry, nonUnicode) => {
    let unicode = mapNonUnicodeToUnicode[nonUnicode]
    carry = carry.replace(new RegExp(unicode, "g"), nonUnicode)
    return carry
  }, str)

  const removedSpace = nonUnicodeStr.replace(/\s/g, "")

  return removedSpace
}
