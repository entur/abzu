export const setDecimalPrecision = (number, n) => {

    if (isNaN(number) || isNaN(n)) {
      throw new Error('setDecimalPrecision, one of the arguments is not a number', number, n)
    }

    let splittedNumbers = String(number).split('.')
    let paddedLength = splittedNumbers[0].length

    return number.toPrecision(paddedLength+n)
}
