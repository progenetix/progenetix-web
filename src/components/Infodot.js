import PropTypes from "prop-types"
import Tippy from "@tippyjs/react"
import { markdownToReact } from "../utils/md"
import { FaInfoCircle } from "react-icons/fa"
import React from "react"

Infodot.propTypes = {
  infoText: PropTypes.string
}
export function Infodot({ infoText }) {
  return (
    <Tippy theme="light-border" content={markdownToReact(infoText)}>
      <span className="icon__wrapper">
        <FaInfoCircle className="ml-2 icon is-small has-text-grey-light" />
      </span>
    </Tippy>
  )
}
