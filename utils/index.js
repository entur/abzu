export const setDecimalPrecision = (number, n) => {

  if (isNaN(number) || isNaN(n)) {
    return number
    //throw new Error('setDecimalPrecision, one of the arguments is not a number', number, n)
  }

  let splittedNumbers = String(number).split('.')
  let paddedLength = splittedNumbers[0].length

  return Number(number.toPrecision(paddedLength+n))
}

export const getIn = (object, keys, defaultValue) => {
  return keys.reduce(function (o, k) {
    return o && typeof o === 'object' && k in o ? o[k] : defaultValue
  }, object)
}

export const getInTransform = (object, keys, defaultValue, transformater) => {
  let value = getIn(object, keys, null)
  return value != null ? transformater(value) : defaultValue
}

export const jsonArrayToCSV = (jsonArray, header, delimiter = ';') => {
  const replacer = (key, value) => value || ''
  let csv = jsonArray.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(delimiter))
  csv.unshift(header.join(delimiter))
  csv = csv.join('\r\n')

  return csv
}