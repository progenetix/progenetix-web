import React from "react"
import cn from "classnames"

export default function Field({ label, required, children, help, hidden }) {
  return (
    <div className={cn("field is-horizontal", { "is-hidden": hidden })}>
      <div className="field-label is-normal">
        <label className="label">
          {label}
          <span
            className={cn("has-text-danger", { "is-invisible": !required })}
          >
            *
          </span>
        </label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control">{children}</div>
          {help && <p className="help is-danger">{help}</p>}
        </div>
      </div>
    </div>
  )
}
