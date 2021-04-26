import { Collapse } from "react-collapse"
import React from "react"
import cn from "classnames"

/*
 * Based on bulma panel
 */
export default function Panel({
  heading,
  children,
  href = false,
  isOpened = true,
  className = "is-light"
}) {
  
  var headlink = ""
  
  if (href) {
    headlink = <a href={href}>{"{↗}"}</a>
  } 
  return (
    <div className={cn("Panel panel", className)}>
      <div className="Panel_heading">
        {heading}{" "}{headlink}
      </div>
      <Collapse isOpened={isOpened}>
        <div className="Panel__block">{children} </div>
      </Collapse>
    </div>
  )
}
