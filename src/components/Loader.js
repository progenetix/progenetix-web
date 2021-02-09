import React from "react"
import { Spinner } from "./Spinner"
import cn from "classnames"

export function Loader({
  isLoading,
  hasError,
  error,
  loadingMessage,
  background = false,
  colored = false,
  children,
  height = null
}) {
  if (isLoading) {
    return (
      <div
        style={{ height }}
        className={cn(
          "Loader",
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
  // Error with default error message
  if (hasError) {
    return (
      <div className="notification is-warning">
        Error while loading data. Please retry.
      </div>
    )
  }

  if (error) {
    return <div className="notification is-warning">{error}</div>
  }
  return typeof children === "function" ? children() : children
}

export function WithData({
  dataEffectResult,
  render,
  background = false,
  colored = false,
  height = null
}) {
  const { data, error, isLoading } = dataEffectResult
  return (
    <Loader
      isLoading={isLoading}
      hasError={error}
      background={background}
      colored={colored}
      height={height}
    >
      {data && render(data)}
    </Loader>
  )
}
