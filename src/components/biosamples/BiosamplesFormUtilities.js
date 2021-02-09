import { useAsyncSelect } from "../../hooks/asyncSelect"
import { useCytomapper } from "../../hooks/api"
import { useGeneSpanSelect } from "../form/GenespanUtilities.js"
import CustomSelect from "../Select"
import React, { useState } from "react"
import PropTypes from "prop-types"
import cn from "classnames"
import { FaCogs } from "react-icons/fa"
import { WithData } from "../Loader"

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

export function GeneSpansUtility({ onClose, setFormValue }) {
  const { inputValue, value, onChange, onInputChange } = useAsyncSelect()
  const { options, error, isLoading } = useGeneSpanSelect(inputValue)
  const onApply = (optionValue) => {
    setFormValue("start", optionValue.start)
    setFormValue("end", optionValue.end)
    setFormValue("referenceName", optionValue.reference_name)
    onClose()
  }
  const renderValue = (optionValue) => (
    <div className="content">
      <div>
        Start: <b>{optionValue.start}</b>
      </div>
      <div>
        End: <b>{optionValue.end}</b>
      </div>
      <div>
        Reference: <b>{optionValue.reference_name}</b>
      </div>
    </div>
  )
  return (
    <div className="message is-link mb-6">
      <div className="message-body">
        <p className="subtitle is-5">Gene Spans</p>
        <CustomSelect
          className="mb-3"
          options={options}
          isLoading={!!inputValue && isLoading}
          onInputChange={onInputChange}
          value={value}
          onChange={onChange}
          placeholder="Type to search..."
        />

        {error && <Error />}
        {value && (
          <>
            <div className="content has-text-black">
              {renderValue(value.value)}
            </div>
            <div className="buttons">
              <button
                onClick={() => onApply(value.value)}
                className="button is-primary"
              >
                Apply
              </button>
              <button onClick={onClose} className="button  is-outlined">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

GeneSpansUtility.propTypes = {
  onClose: PropTypes.func.isRequired,
  setFormValue: PropTypes.func.isRequired
}

export function CytoBandsUtility({ onClose, setFormValue }) {
  const [inputValue, setInputValue] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const apiReply = useCytomapper(searchValue)
  const onApply = (data) => {
    setFormValue("start", data.results[0].GenomicLocation.interval.start)
    setFormValue("end", data.results[0].GenomicLocation.interval.end)
    setFormValue("referenceName", data.results[0].GenomicLocation.chr)
    onClose()
  }
  const onSubmit = (e) => {
    e.preventDefault()
    setSearchValue(inputValue)
  }
  return (
    <div>
      <div className="message is-link mb-6">
        <div className="message-body">
          <p className="subtitle is-5">CytoBands</p>
          <form onSubmit={onSubmit} className="field has-addons mb-4">
            <div className="control">
              <input
                onChange={(e) => setInputValue(e.target.value)}
                className="input"
                type="text"
                placeholder="Ex: 8q21"
              />
            </div>
            <div className="control">
              <button className="button" type="submit">
                Search
              </button>
            </div>
          </form>
          {searchValue && (
            <WithData
              apiReply={apiReply}
              render={(data) => {
                const info = data.results[0]?.info
                const hasResults = !!info?.cytoBands
                return (
                  <>
                    {hasResults ? (
                      <CytoBandsData data={data.results} />
                    ) : (
                      <div className="notification is-light">No results.</div>
                    )}
                    <div className="buttons">
                      <button
                        disabled={!hasResults}
                        onClick={() => onApply(data)}
                        className="button is-primary"
                      >
                        Apply
                      </button>
                      <button onClick={onClose} className="button  is-outlined">
                        Close
                      </button>
                    </div>
                  </>
                )
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function CytoBandsData({ data }) {
  return (
    <div className="content has-text-black">
      <div>
        CytoBands: <b>{data[0].info.cytoBands}</b>
      </div>
      <div>
        Start: <b>{data[0].GenomicLocation.interval.start}</b>
      </div>
      <div>
        End: <b>{data[0].GenomicLocation.interval.end}</b>
      </div>
      <div>
        Reference Name: <b>{data[0].GenomicLocation.chr}</b>
      </div>
    </div>
  )
}

CytoBandsUtility.propTypes = {
  onClose: PropTypes.func.isRequired,
  setFormValue: PropTypes.func.isRequired
}

function Error() {
  return <div className="notification is-warning">Could not load data...</div>
}
