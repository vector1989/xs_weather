/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  return str.trim().length > 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate idNumber
 * @param idNumber
 * @returns {boolean}
 */
export function isValidateIdNumber(idNumber) {
  const re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return re.test(idNumber)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function isValidateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * validate phoneNumber
 * @param phoneNumber
 * @returns {boolean}
 */
export function isValidatePhoneNumber(phoneNumber) {
  const re = /^1\d{10}$/
  return re.test(phoneNumber)
}

/**
 *排序号
 *
 * @export
 * @param {*} sortno
 * @returns
 */
export function isValidateSortno(sortno) {
  const re = /^\+?[1-9][0-9]*$/
  return re.test(sortno)
}

/**
 * 固定电话号
 * @param phoneNumber
 * @returns {boolean}
 */
export function isValidateLocalPhoneNumber(phoneNumber) {
  const re = /0\d{2,4}-\d{7,8}/
  return re.test(phoneNumber)
}
