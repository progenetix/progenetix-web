import React from "react"
import { Spinner } from "./Spinner"
import cn from "classnames"

export function Loader({
  isLoading,
  hasError,
  loadingMessage,
  errorMessage = "Error while loading data. Please retry.",
  background = true,
  colored = false,
  children
}) {
  if (isLoading) {
    return (
      <div
        className={cn(
          background && "notification",
          colored && "is-info is-light"
        )}
      >
        {loadingMessage && (
          <div className="has-text-centered subtitle">{loadingMessage}</div>
        )}
        <Spinner />
      </div>
    )
  }
  if (hasError) {
    return <div className="notification is-warning">{errorMessage}</div>
  }
  return typeof children === "function" ? children() : children
}
