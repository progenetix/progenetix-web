import React, { useEffect } from "react"
import PropTypes from "prop-types"
import CustomSelect from "../Select"

export default function ControlledSelect({
  name,
  defaultValue,
  watch,
  setValue,
  register,
  rules = {},
  options = [],
  className,
  ...selectProps
}) {
  // We use this instead of the Controller to map the values. So [{value, label}] becomes [value]
  const formValue = watch(name)
  let selectValue
  if (Array.isArray(formValue)) {
    selectValue = options?.filter(({ value }) => formValue.includes(value))
  } else {
    selectValue = options?.filter(({ value }) => formValue === value)
  }

  useEffect(() => {
    register({ name }, rules)
    setValue(name, defaultValue)
  }, [register])

  const handleChange = (v) => {
    let value
    if (Array.isArray(v)) {
      value = v.map(({ value }) => value)
    } else {
      value = v?.value
    }
    setValue(name, value)
  }
  return (
    <CustomSelect
      options={options}
      value={selectValue}
      onChange={handleChange}
      className={className}
      classNamePrefix="react-select"
      {...selectProps}
    />
  )
}

ControlledSelect.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object,
  options: PropTypes.array
}
