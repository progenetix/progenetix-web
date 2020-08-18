import cn from "classnames"
import React from "react"
import PropTypes from "prop-types"
import CustomSelect from "../Select"
import { Controller } from "react-hook-form"

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
  errors: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object
}

export default function SelectField({
  name,
  label,
  isHidden,
  errors,
  options,
  control,
  rules,
  ...selectProps
}) {
  const help = errors[name]?.message
  return (
    <div
      className={cn("field ", {
        "is-hidden": isHidden,
        "is-danger": errors[name]
      })}
    >
      <label className="label">{label}</label>
      <div className="control">
        <Controller
          render={({ onChange, onBlur, value }) => {
            return (
              <CustomSelect
                onBlur={onBlur}
                onChange={(v) => onChange(selectToForm(v))}
                value={formToSelect(value, options)}
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

function formToSelect(formValue, options) {
  if (Array.isArray(formValue)) {
    return options?.filter(({ value }) => value && formValue.includes(value))
  } else {
    return options?.filter(({ value }) => value && formValue === value)
  }
}

function selectToForm(value) {
  if (Array.isArray(value)) {
    return value.map(({ value }) => value)
  } else {
    return value?.value ?? null
  }
}
