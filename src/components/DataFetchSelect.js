import React from "react"
import PropTypes from "prop-types"
import Field from "./Field"
import cn from "classnames"

/*
 * Fetch data and generate a select.
 * useFetch hook is supposed to return an array of elements of {id: String, label: String}.
 */
export default function DataFetchSelect({
  useFetch,
  name,
  label,
  required,
  register,
  errors,
  autoSelectFirst
}) {
  const { data, error } = useFetch()
  if (error)
    return <div className="notification is-warning">Could not load data.</div>

  return (
    <Field label={label} required={required}>
      <div
        className={cn("select", "is-fullwidth", "is-multiple", {
          "is-danger": errors[name]
        })}
      >
        {data ? (
          <select name={name} multiple ref={register({ required: required })}>
            {data.map((ds, i) => (
              <option
                key={ds.id}
                value={ds.id}
                selected={autoSelectFirst && i === 0}
              >
                {ds.label}
              </option>
            ))}
          </select>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </Field>
  )
}

DataFetchSelect.propTypes = {
  useFetch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  autoSelectFirst: PropTypes.bool
}
