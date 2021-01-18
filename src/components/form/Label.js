import PropTypes from "prop-types"
import { Infodot } from "../Infodot"
import React from "react"

Label.propTypes = {
  label: PropTypes.node.isRequired,
  infoText: PropTypes.string
}

export function Label({ label, infoText }) {
  return (
    <div className="InputLabel__Wrapper">
      <label>{label}</label>
      {infoText && <Infodot infoText={infoText} />}
    </div>
  )
}
