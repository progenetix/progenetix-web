import { useAsyncSelect } from "../../effects/asyncSelect"
import { useCytomapper, useGeneSpans } from "../../effects/api"
import CustomSelect from "../Select"
import React from "react"
import PropTypes from "prop-types"

function useGenSpanSelect(inputValue) {
  const { data, error } = useGeneSpans(inputValue)
  let options = []
  if (data) {
    options = data.genes.map((g) => ({ value: g, label: g.gene_symbol }))
  }
  return { data, error, options }
}

export function GeneSpansControlPanel({ onClose, setFormValue }) {
  const onApply = (optionValue) => {
    setFormValue("start", optionValue.cds_start_min)
    setFormValue("referenceName", optionValue.reference_name)
    onClose()
  }
  const renderValue = (optionValue) => (
    <div className="content">
      <div>
        Start: <b>{optionValue.cds_start_min}</b>
      </div>
      <div>
        Reference: <b>{optionValue.reference_name}</b>
      </div>
    </div>
  )
  return (
    <FormControlPanel
      label="Gene Spans"
      selectEffect={useGenSpanSelect}
      onApplyClick={onApply}
      renderValue={renderValue}
      onCloseClick={onClose}
    />
  )
}

GeneSpansControlPanel.propTypes = {
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

export function CytoBandsControlPanel({ onClose, setFormValue }) {
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
      <FormControlPanel
        label="Cytoband(s)"
        selectEffect={useCytoBandsSelect}
        onApplyClick={onApply}
        renderValue={renderValue}
        onCloseClick={onClose}
      />
    </div>
  )
}

CytoBandsControlPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  setFormValue: PropTypes.func.isRequired
}

FormControlPanel.propTypes = {
  label: PropTypes.string.isRequired,
  selectEffect: PropTypes.func.isRequired,
  renderValue: PropTypes.func.isRequired,
  onApplyClick: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

function FormControlPanel({
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
