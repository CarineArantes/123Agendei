interface FormatParams {
  params: Array<string | number>
  text: string
}

interface FormatParamsSameKeyByArray {
  params: Array<string | number>
  key: string
}

type FormatParamsOptions = {
  isSameKey?: boolean
  isRouteParam?: boolean
}

type QueriesParams = {
  key: string
  value?: string | number
  validate?: () => boolean
}[]

type QueriesOptions = {
  isObject: boolean
}

export class Format {

  private static _defaultOptions = {
    params: {
      isSameKey: false,
      isRouteParam: false,
    },
    queries: {
      isObject: false,
    },
  }

  static params(input: FormatParams, options?: FormatParamsOptions) {
    const { params, text } = input
    const { isSameKey, isRouteParam } = options || Format._defaultOptions.params

    if (isSameKey) return Format.paramsSameKeyByArray({ key: text, params })

    if (isRouteParam) {
      return Format.paramsRoute({ params, text }, options)
    }

    const parameters = text.match(/{(\d+)}/g)
    const hasParameters = parameters !== null
    if (!hasParameters) return text
    let textFormatted = text
    parameters.forEach((parameter, index) => {
      textFormatted = textFormatted.replace(parameter, String(params[index]))
    })
    return textFormatted
  }

  static queriesParams(queries: QueriesParams, options?: QueriesOptions) {
    const { isObject } = options || Format._defaultOptions.queries

    if (isObject) {
      let paramsArray: { key: string; value: any }[] = []

      queries.forEach((query) => {
        if (query.value === undefined) return

        if (query.validate === undefined) {
          paramsArray.push({
            key: query.key,
            value: query.value,
          })
        } else if (query.validate()) {
          paramsArray.push({
            key: query.key,
            value: query.value,
          })
        }
      })

      return paramsArray.reduce((acc, cur) => {
        acc[cur.key] = cur.value

        return acc
      }, {} as { [key: string]: any }) as { [key: string]: any }
    }

    return queries
      .filter((query) => {
        if (query.value?.toString().trim() === '' ?? true) {
          return false
        }
        if (query.validate === undefined) {
          return true
        }

        return query.validate()
      })
      .map((query) => `${query.key}=${query.value}`)
      .join('&')
  }

  static onlyNumber(value: string) {
    value = value.replace(/\D/g, '')
    return value
  }

  static maskPhone(value: string) {
    value = value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    return value;
  }

  static maskHour(value: string) {
    value = value.replace(/\D/g, '')
    value = value.replace(/^(\d{2})(\d)/g, '$1:$2')
    return value
  }

  static maskDocumentExactLength(value: string) {
    if (value.length !== 11 && value.length !== 14) return value

    return Format.maskCPFCNPJ(value)
  }

  static paramsRoutePathName(text: string, value: string) {
    return text.replace(/:(.*?)(?=\/|$)/g, value)
  }

  static maskCPFCNPJ(value: string) {
    if (value) return
    value = value.replace(/\D/g, '')
    if (value.length <= 11) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1-$2')
      return value
    } else {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
      return value
    }
  }

  static maskCPF(value: string) {
    value = value.replace(/\D/g, '')
    value = value.replace(/^(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1-$2')
    return value
  }

  static maskCNPJ(value: string) {
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
    return value
  }

  static maskCEP(value: string) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value;
  }
  

  static removeSpecialCharacters(value: string) {
    return value.replace(/[^a-zA-Z0-9]/g, '')
  }

  static insertArrayIf<T = any>(condicional: boolean, ...elements: T[]) {
    return condicional ? elements : []
  }

  static currency(value: number) {
    return new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(value)
  }

  static maxLengthString(value: string, length: number) {
    const valueIsMoreThanMax = value.length > length

    if (valueIsMoreThanMax) {
      return `${value.slice(0, length - 4)}...`
    }

    return value
  }

  static convertMMtoPT(mm: number) {
    return mm / 2.835
  }

  static paramsSameKeyByArray(props: FormatParamsSameKeyByArray) {
    const { key, params } = props

    return params.map((item) => `${key}=${item}`).join('&')
  }

  static paramsRoute(input: FormatParams, options?: FormatParamsOptions) {
    const { params, text } = input
    const { isSameKey } = options || Format._defaultOptions.params

    const parameters = text
      .replace(/(https?:\/\/)/g, '')
      .match(/:(.*?)(?=\/|$)/g)
    const hasParameters = parameters !== null
    if (!hasParameters || params.length === 0) return text

    if (isSameKey) {
      let textFormatted = text
      parameters.forEach((parameter) => {
        textFormatted = textFormatted.replace(parameter, String(params[0]))
      })
      return textFormatted
    }

    let textFormatted = text
    parameters.forEach((parameter, index) => {
      textFormatted = textFormatted.replace(parameter, String(params[index]))
    })
    return textFormatted
  }

  static date(value: string, format: 'pt-br' | 'en') {
    switch (format) {
      case 'pt-br':
        return value.split("-").reverse().join(" / ")
      case 'en':
        return value.split("/").reverse().join(" - ")
      default:
        return value
    }
  }

  static money(value: number, format: 'pt-br' | 'en') {
    const options = {
      style: 'currency',
      currency: format === 'pt-br' ? 'BRL' : 'USD',
    };
    return new Intl.NumberFormat(format, options).format(value);
  }
}
