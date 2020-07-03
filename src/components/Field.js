import React from "react"
import PropTypes from "prop-types"

export default function Field({ label, required, children }) {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">
          {label}
          <span className={`has-text-danger ${!required && "is-invisible"}`}>
            *
          </span>
        </label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control">{children}</div>
        </div>
      </div>
    </div>
  )
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  required: PropTypes.bool
}
