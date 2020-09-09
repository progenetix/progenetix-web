import React from "react"
import cn from "classnames"
import PropTypes from "prop-types"

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.any,
  isHidden: PropTypes.bool,
  errors: PropTypes.object,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object
}

export default function InputField({
  name,
  label,
  placeholder,
  isHidden,
  errors,
  register,
  rules,
  defaultValue,
  className
}) {
  const help = errors[name]?.message
  return (
    <div className={cn("field", { "is-hidden": isHidden }, className)}>
      <label className="label">{label}</label>
      <p className="control">
        <input
          name={name}
          className={cn("input", {
            "is-danger": errors[name]
          })}
          ref={register(rules)}
          type="text"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </p>
      {help && <p className="help is-danger">{help}</p>}
    </div>
  )
}
