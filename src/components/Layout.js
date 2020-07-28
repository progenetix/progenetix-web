import React from "react"

export function Layout({ title, children }) {
  return (
    <div>
      <header
        className="has-background-visual-identity"
        style={{ height: "2rem" }}
      />
      <div className="section">
        <div className="container">
          <h1 className="title is-2">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  )
}
