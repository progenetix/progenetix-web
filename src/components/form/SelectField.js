import cn from "classnames"
import ControlledSelect from "./ControlledSelect"
import React from "react"
import PropTypes from "prop-types"

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
  errors: PropTypes.object,
  register: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  rules: PropTypes.object
}

export default function SelectField({
  name,
  label,
  isHidden,
  errors,
  register,
  watch,
  setValue,
  rules,
  ...selectProps
}) {
  const help = errors[name]?.message

  return (
    <div className={cn("field ", { "is-hidden": isHidden })}>
      <label className="label">{label}</label>
      <div className="control">
        <ControlledSelect
          className={cn(errors[name] && "is-danger")}
          name={name}
          watch={watch}
          setValue={setValue}
          register={register}
          rules={rules}
          {...selectProps}
        />
      </div>
      {help && <p className="help is-danger">{help}</p>}
    </div>
  )
}
