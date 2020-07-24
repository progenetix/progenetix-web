import { useState } from "react"
import { debounce } from "lodash"

// Use with react-select
export function useAsyncSelect() {
  const [inputValue, setInputValue] = useState(null)
  const [value, setValue] = useState(null)
  const onInputChange = debounce((v, { action }) => {
    if (action === "input-change") {
      setInputValue(v)
      setValue(null)
    }
  }, 200)
  const onChange = (v, { action }) => {
    if (action === "select-option") {
      setValue(v)
    }
  }
  return { inputValue, onInputChange, value, onChange }
}
