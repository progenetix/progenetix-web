import { useAsyncSelect } from "../../hooks/asyncSelect"
import { useCytomapper, useGeneSpans } from "../../hooks/api"
import CustomSelect from "../Select"
import React, { useState } from "react"
import PropTypes from "prop-types"
import cn from "classnames"
import { FaCogs } from "react-icons/fa"

FormUtilitiesButtons.propTypes = {
  onGeneSpansClick: PropTypes.func.isRequired,
  geneSpansPanelOpen: PropTypes.bool.isRequired,
  onCytoBandClick: PropTypes.func.isRequired,
  cytoBandPanelOpen: PropTypes.bool.isRequired
}

export function useFormUtilities() {
  const [cytoBandPanelOpen, setCytoBandPanelOpen] = useState(false)
  const [geneSpansPanelOpen, setgeneSpansPanelOpen] = useState(false)
  const onCytoBandClick = () => {
    setCytoBandPanelOpen(!cytoBandPanelOpen)
    setgeneSpansPanelOpen(false)
  }
  const onCytoBandCloseClick = () => setCytoBandPanelOpen(false)

  const onGeneSpansClick = () => {
    setgeneSpansPanelOpen(!geneSpansPanelOpen)
    setCytoBandPanelOpen(false)
  }
  const onGeneSpansCloseClick = () => setgeneSpansPanelOpen(false)
  return {
    cytoBandPanelOpen,
    onCytoBandClick,
    onCytoBandCloseClick,
    geneSpansPanelOpen,
    onGeneSpansClick,
    onGeneSpansCloseClick
  }
}

export function FormUtilitiesButtons({
  onGeneSpansClick,
  geneSpansPanelOpen,
  onCytoBandClick,
  cytoBandPanelOpen
}) {
  return (
    <div className="buttons">
      <button
        className={cn("button", [geneSpansPanelOpen && "is-link"])}
        onClick={onGeneSpansClick}
      >
        <span className="icon">
          <FaCogs />
        </span>
        <span>Gene Spans</span>
      </button>
      <button
        className={cn("button", [cytoBandPanelOpen && "is-link"])}
        onClick={onCytoBandClick}
      >
        <span className="icon">
          <FaCogs />
        </span>
        <span>Cytoband(s)</span>
      </button>
    </div>
  )
}

function useGenSpanSelect(inputValue) {
  const { data, error } = useGeneSpans(inputValue)
  let options = []
  if (data) {
    options = data.genes.map((g) => ({ value: g, label: g.gene_symbol }))
  }
  return { data, error, options }
}

export function GeneSpansUtility({ onClose, setFormValue }) {
  const onApply = (optionValue) => {
    setFormValue("start", optionValue.cds_start_min)
    setFormValue("end", optionValue.cds_end_max)
    setFormValue("referenceName", optionValue.reference_name)
    onClose()
  }
  const renderValue = (optionValue) => (
    <div className="content">
      <div>
        Start: <b>{optionValue.cds_start_min}</b>
      </div>
      <div>
        End: <b>{optionValue.cds_end_max}</b>
      </div>
      <div>
        Reference: <b>{optionValue.reference_name}</b>
      </div>
    </div>
  )
  return (
    <FormUtility
      label="Gene Spans"
      selectEffect={useGenSpanSelect}
      onApplyClick={onApply}
      renderValue={renderValue}
      onCloseClick={onClose}
    />
  )
}

GeneSpansUtility.propTypes = {
  onClose: PropTypes.func.isRequired,
  setFormValue: PropTypes.func.isRequired
}

function useCytoBandsSelect(inputValue) {
  const { data, error } = useCytomapper(inputValue)
  let options = []
  if (data) {
    // TODO
  }
  return { data, error, options }
}

export function CytoBandsUtility({ onClose, setFormValue }) {
  const onApply = (optionValue) => {
    // TODO
    setFormValue(optionValue.todo)
    onClose()
  }
  const renderValue = (optionValue) => (
    <div className="content">
      <div>???: {optionValue.todo}</div>
    </div>
  )
  return (
    <div>
      <FormUtility
        label="Cytoband(s)"
        selectEffect={useCytoBandsSelect}
        onApplyClick={onApply}
        renderValue={renderValue}
        onCloseClick={onClose}
      />
    </div>
  )
}

CytoBandsUtility.propTypes = {
  onClose: PropTypes.func.isRequired,
  setFormValue: PropTypes.func.isRequired
}

FormUtility.propTypes = {
  label: PropTypes.string.isRequired,
  selectEffect: PropTypes.func.isRequired,
  renderValue: PropTypes.func.isRequired,
  onApplyClick: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

function FormUtility({
  label,
  selectEffect,
  renderValue,
  onApplyClick,
  onCloseClick
}) {
  const { inputValue, value, onChange, onInputChange } = useAsyncSelect()
  let { options, error } = selectEffect(inputValue)
  const isLoading = inputValue && !options && !error

  return (
    <div className="message is-link mb-6">
      <div className="message-body">
        <p className="subtitle is-5">{label}</p>
        <CustomSelect
          className="mb-3"
          options={options}
          isLoading={isLoading}
          onInputChange={onInputChange}
          value={value}
          onChange={onChange}
        />

        {error && <Error />}
        {value && (
          <>
            <div className="content has-text-black">
              {renderValue(value.value)}
            </div>
            <div className="buttons">
              <button
                onClick={() => onApplyClick(value.value)}
                className="button is-primary"
              >
                Apply
              </button>
              <button onClick={onCloseClick} className="button  is-outlined">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Error() {
  return <div className="notification is-warning">Could not load data...</div>
}
