import { ZodErrorMap, ZodError, z } from "zod";

export default () => {
    const { t, locale } = useI18n()
    const ns = "";
    const handlePath = {
        context: "with_path",
        ns,
        keyPrefix: undefined
    };

    const jsonStringifyReplacer = (_: string, value: any): any => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
    };

    function joinValues<T extends any[]>(array: T, separator = " | "): string {
        return array
          .map((val) => (typeof val === "string" ? `'${val}'` : val))
          .join(separator);
    }

    const getMessage = (issue: any) => {
        let message = "";
        const path =
            issue.path.length > 0
            ? {
                context: handlePath.context,
                path: t("zod."+
                    [handlePath.keyPrefix, issue.path.join(".")]
                    .filter(Boolean)
                    .join("."),
                        {
                        ns: handlePath.ns,
                        defaultValue: issue.path.join("."),
                        }
                ),
                }
            : {};

        switch (issue.code) {
            case "invalid_type":
            if (issue.received === "undefined") {
                message = t("zod.errors.invalid_type_received_undefined", {
                    ns,
                    defaultValue: message,
                    ...path,
                });
            } else {
                message = t("zod.errors.invalid_type", {
                    expected: t(`zod.types.${issue.expected}`, {
                        defaultValue: issue.expected,
                        ns,
                    }),
                    received: t(`zod.types.${issue.received}`, {
                        defaultValue: issue.received,
                        ns,
                    }),
                    ns,
                    defaultValue: message,
                    ...path,
                });
            }
            break;
            case "invalid_literal":
                message = t("zod.errors.invalid_literal", {
                    expected: JSON.stringify(issue.expected, jsonStringifyReplacer),
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "unrecognized_keys":
                message = t("zod.errors.unrecognized_keys", {
                    keys: joinValues(issue.keys, ", "),
                    count: issue.keys.length,
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "invalid_union":
                message = t("zod.errors.invalid_union", {
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "invalid_union_discriminator":
                message = t("zod.errors.invalid_union_discriminator", {
                    options: joinValues(issue.options),
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "invalid_enum_value":
                message = t("zod.errors.invalid_enum_value", {
                    options: joinValues(issue.options),
                    received: issue.received,
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "invalid_arguments":
                message = t("zod.errors.invalid_arguments", {
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "invalid_return_type":
                message = t("zod.errors.invalid_return_type", {
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "invalid_date":
                message = t("zod.errors.invalid_date", {
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "invalid_string":
                if (typeof issue.validation === "object") {
                    if ("startsWith" in issue.validation) {
                    message = t(`zod.errors.invalid_string.startsWith`, {
                        startsWith: issue.validation.startsWith,
                        ns,
                        defaultValue: message,
                        ...path,
                    });
                    } else if ("endsWith" in issue.validation) {
                    message = t(`zod.errors.invalid_string.endsWith`, {
                        endsWith: issue.validation.endsWith,
                        ns,
                        defaultValue: message,
                        ...path,
                    });
                    }
                } else {
                    message = t(`zod.errors.invalid_string.${issue.validation}`, {
                        validation: t(`zod.validations.${issue.validation}`, {
                            defaultValue: issue.validation,
                        }),
                        defaultValue: message,
                        ...path,
                    });
                }
            break;
            case "too_small":
                const minimum =
                    issue.type === "date"
                    ? new Date(issue.minimum as number)
                    : issue.minimum;
                message = t(
                    `zod.errors.too_small.${issue.type}.${
                    issue.exact
                        ? "exact"
                        : issue.inclusive
                        ? "inclusive"
                        : "not_inclusive"
                    }`,
                    {
                    minimum,
                    count: typeof minimum === "number" ? minimum : undefined,
                    ns,
                    defaultValue: message,
                    ...path,
                    }
                );
            break;
            case "too_big":
                const maximum =
                    issue.type === "date"
                    ? new Date(issue.maximum as number)
                    : issue.maximum;
                message = t(
                    `zod.errors.too_big.${issue.type}.${
                    issue.exact
                        ? "exact"
                        : issue.inclusive
                        ? "inclusive"
                        : "not_inclusive"
                    }`,
                    {
                    maximum,
                    count: typeof maximum === "number" ? maximum : undefined,
                    ns,
                    defaultValue: message,
                    ...path,
                    }
                );
            break;
            case "custom":
                message = t(issue.params?.i18n ?? "zod.errors.custom", {
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "invalid_intersection_types":
                message = t("zod.errors.invalid_intersection_types", {
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "not_multiple_of":
                message = t("zod.errors.not_multiple_of", {
                    multipleOf: issue.multipleOf,
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            case "not_finite":
                message = t("zod.errors.not_finite", {
                    ns,
                    defaultValue: message,
                    ...path,
                });
            break;
            default:
        }
        
        return message;
    }


    return {
        getMessage
    }
}