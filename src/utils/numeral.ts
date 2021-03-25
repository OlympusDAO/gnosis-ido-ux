import numbro from 'numbro'

export const abbreviation = (_value: string | number) => {
  const value = Number(_value)

  if (!isNaN(value)) {
    const valueSplitted: Array<string> = value.toString().split('.')
    const leftSide: String | null = valueSplitted[0] || null
    const parseValue: numbro.Numbro = numbro(value)
    const format = {
      spaceSeparated: false,
      optionalMantissa: true,
      trimMantissa: true,
      average: false,
      mantissa: 6,
    }

    // If the value is greater than 9999, it will be short. For example: 10000 => 10k or 1000000 => 1m
    // if the value is small like 0.00000000000001 (1e-14), it will be excluded
    if (leftSide && leftSide.length > 4 && !leftSide.includes('e-')) {
      format.average = true
      format.mantissa = 2
    }

    if (parseValue && parseValue.value() !== undefined) {
      return parseValue.format(format)?.toUpperCase()
    }
  }

  return value
}
