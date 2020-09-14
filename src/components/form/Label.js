import PropTypes from "prop-types"
import Tippy from "@tippyjs/react"
import { markdownToReact } from "../../utils/md"
import { FaInfoCircle } from "react-icons/fa"
import React from "react"

Label.propTypes = {
  label: PropTypes.string.isRequired,
  infoText: PropTypes.string
}

export function Label({ label, infoText }) {
  return (
    <div className="InputLabel__Wrapper">
      <label>{label}</label>
      {infoText && (
        <Tippy theme="light-border" content={markdownToReact(infoText)}>
          <span className="icon__wrapper">
            <FaInfoCircle className="ml-2 icon is-small has-text-grey-light" />
          </span>
        </Tippy>
      )}
    </div>
  )
}
