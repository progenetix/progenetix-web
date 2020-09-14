import { Collapse } from "react-collapse"
import React from "react"
import cn from "classnames"

/*
 * Based on bulma panel
 */
export default function Panel({
  heading,
  children,
  isOpened = true,
  className = "is-light"
}) {
  return (
    <div className={cn("Panel panel", className)}>
      <div className="Panel_heading">{heading}</div>
      <Collapse isOpened={isOpened}>
        <div className="Panel__block">{children} </div>
      </Collapse>
    </div>
  )
}
