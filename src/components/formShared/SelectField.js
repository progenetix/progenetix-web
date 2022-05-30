import cn from "classnames"
import React from "react"
import PropTypes from "prop-types"
import CustomSelect from "../Select"
import { Controller } from "react-hook-form"
import { Label } from "./Label"

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  infoText: PropTypes.string,
  isHidden: PropTypes.bool,
  isMulti: PropTypes.bool,
  errors: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  useOptionsAsValue: PropTypes.bool
}

export default function SelectField({
  name,
  label,
  infoText,
  isHidden,
  isMulti,
  errors,
  options,
  control,
  rules,
  // when false, we map the options to they values, otherwise we simply pass what react-select gives
  useOptionsAsValue = false,
  className,
  ...selectProps
}) {
  const help = errors[name]?.message
  return (
    <div
      className={cn(
        "field",
        {
          "is-hidden": isHidden,
          "is-danger": errors[name]
        },
        className
      )}
    >
      <Label label={label} infoText={infoText} />
      <div className="control">
        <Controller
          render={({ onChange, onBlur, value }) => {
            return (
              <CustomSelect
                isMulti={isMulti}
                onBlur={onBlur}
                onChange={(v) =>
                  useOptionsAsValue
                    ? onChange(v)
                    : onChange(optionsToValues(v, { isMulti, name }))
                }
                value={
                  useOptionsAsValue
                    ? value
                    : valuesToOptions(value, options, { isMulti, name })
                }
                options={options}
                classNamePrefix="react-select"
                {...selectProps}
              />
            )
          }}
          name={name}
          control={control}
          rules={rules}
        />
      </div>
      {help && <p className="help is-danger">{help}</p>}
    </div>
  )
}

function valuesToOptions(formValue, options, { isMulti, name }) {
  if (isMulti) {
    if (formValue == null) return []
    if (!Array.isArray(formValue)) {
      throw new Error(
        `Array value expected for a ${name} set with ${isMulti} but received ${formValue}. Make sure the defaultValue is an array.`
      )
    } else
      return options?.filter(({ value }) => value && formValue.includes(value))
  } else {
    return options?.filter(({ value }) => value && formValue === value)
  }
}

function optionsToValues(value, { isMulti }) {
  if (isMulti) {
    if (value == null) return null
    return value.map(({ value }) => value)
  } else {
    return value?.value ?? null
  }
}
