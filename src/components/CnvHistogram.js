import React from "react"
import PropTypes from "prop-types"
import styles from "./CnvHistogram.module.scss"

export default function CnvHistogram({ url }) {
  return (
    <>
      <span className={styles.title}>CNV Histogram</span>
      <img className={styles.img} src={url} />
    </>
  )
}

CnvHistogram.propTypes = {
  url: PropTypes.string.isRequired
}
