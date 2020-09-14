import React from "react"
import cn from "classnames"
import PropTypes from "prop-types"
import { Label } from "./Label"

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  infoText: PropTypes.string,
  placeholder: PropTypes.any,
  isHidden: PropTypes.bool,
  errors: PropTypes.object,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object
}

export default function InputField({
  name,
  label,
  infoText,
  placeholder,
  isHidden,
  errors,
  register,
  rules,
  defaultValue,
  type = "text",
  className
}) {
  const help = errors[name]?.message
  return (
    <div className={cn("field", { "is-hidden": isHidden }, className)}>
      <Label label={label} infoText={infoText} />
      <p className="control">
        <input
          name={name}
          className={cn("input", {
            "is-danger": errors[name]
          })}
          ref={register(rules)}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </p>
      {help && <p className="help is-danger">{help}</p>}
    </div>
  )
}
