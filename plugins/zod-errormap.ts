import type { Composer } from 'vue-i18n'
import { z } from 'zod'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin({
  name: 'zodI18n:plugin',
  dependsOn: ['i18n:plugin'],
  parallel: true,
  setup: (nuxtApp) => {
    const { dateFormat } = useRuntimeConfig().public.zodI18n
    const i18n = nuxtApp.$i18n as Composer
    const { t, d } = i18n

    const errorMap = (error: any, ctx: any) => {
      let message: string = "Invalid value"

      switch (error.code) {
        case "invalid_type":
          if (error.received === "undefined") {
            message = t('zod.errors.invalid_type_received_undefined')
          }
          else {
            message = t('zod.errors.invalid_type', {
              expected: t(`zod.types.${error.expected}`),
              received: t(`zod.types.${error.received}`),
            })
          }
          break
        case "invalid_literal":
          message = t('zod.errors.invalid_literal', {
            expected: JSON.stringify(error.expected, jsonStringifyReplacer),
          })
          break
        case "unrecognized_keys":
          message = t('zod.errors.unrecognized_keys', {
            keys: joinValues(error.keys, ', '),
          })
          break
        case "invalid_union":
          message = t('zod.errors.invalid_union')
          break
        case "invalid_union_discriminator":
          message = t('zod.errors.invalid_union_discriminator', {
            options: joinValues(error.options),
          })
          break
        case "invalid_enum_value":
          message = t('zod.errors.invalid_enum_value', {
            options: joinValues(error.options),
            received: error.received,
          })
          break
        case "invalid_arguments":
          message = t('zod.errors.invalid_arguments')
          break
        case "invalid_return_type":
          message = t('zod.errors.invalid_return_type')
          break
        case "invalid_date":
          message = t('zod.errors.invalid_date')
          break
        case "invalid_string":
          if (typeof error.validation === 'object') {
            if ('startsWith' in error.validation) {
              message = t('zod.errors.invalid_string.startsWith', {
                startsWith: error.validation.startsWith,
              })
            }
            else if ('endsWith' in error.validation) {
              message = t('zod.errors.invalid_string.endsWith', {
                endsWith: error.validation.endsWith,
              })
            }
          }
          else {
            message = t(`zod.errors.invalid_string.${error.validation}`, {
              validation: t(`zod.validations.${error.validation}`),
            })
          }
          break
        case "too_small":
          message = t(
            `zod.errors.too_small.${error.type}.${
              error.exact ? 'exact' : error.inclusive ? 'inclusive' : 'not_inclusive'
            }`,
            {
              minimum: error.type === 'date' ? d(new Date(error.minimum as number), dateFormat) : error.minimum,
            },
          )
          break
        case "too_big":
          message = t(
            `zod.errors.too_big.${error.type}.${
              error.exact ? 'exact' : error.inclusive ? 'inclusive' : 'not_inclusive'
            }`,
            {
              maximum: error.type === 'date' ? d(new Date(error.maximum as number), dateFormat) : error.maximum,
            },
          )
          break
        case "custom":
          // eslint-disable-next-line no-case-declarations
          const { key, values } = getKeyAndValues(error.params?.i18n, 'zod.errors.custom', i18n)
          message = t(key, values)
          break
        case "invalid_intersection_types":
          message = t('zod.errors.invalid_intersection_types')
          break
        case "not_multiple_of":
          message = t('zod.errors.not_multiple_of', {
            multipleOf: error.multipleOf,
          })
          break
        case "not_finite":
          message = t('zod.errors.not_finite')
          break
        default:
          break
      }

      return { message }
    }

    z.setErrorMap(errorMap as any)
  },
})


function joinValues<T>(array: T[], separator = ' | '): string {
  return array
    .map(val => (typeof val === 'string' ? `'${val}'` : val))
    .join(separator)
}

function jsonStringifyReplacer<T>(_: string, value: T): T | string {
  if (typeof value === 'bigint') {
    return value.toString()
  }

  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      return false
    }
  }

  return true
}

function getKeyAndValues(
  param: unknown,
  defaultKey: string,
  i18n: Composer,
): {
    values: Record<string, string>
    key: string
  } {
  const { t } = i18n
  if (typeof param === 'string') {
    return { key: param, values: {} }
  }

  if (isRecord(param)) {
    const key = 'key' in param && typeof param.key === 'string' ? param.key : defaultKey
    const values = 'values' in param && isRecord(param.values) ? Object.entries(param.values).reduce((acc, [key, value]) => {
            acc = { ...acc, [key]: t(value as string) }
            return acc
          }, {})
        : {}

    return { key, values }
  }

  return { key: defaultKey, values: {} }
}