import { useAsyncSelect } from "../../hooks/asyncSelect"
import { useGeneSymbol } from "../../hooks/api"
import SelectField from "../form/SelectField"
import React from "react"

export function GeneSymbolSelector({
  name,
  label,
  control,
  errors,
  register,
  className
}) {
  const { inputValue, onInputChange } = useAsyncSelect()
  const { data, isLoading } = useGeneSymbol({ geneId: inputValue })
  let options = []
  if (data) {
    options = data.response.results.map((g) => ({
      value: g.symbol,
      data: g,
      label: `${g.symbol} (${g.referenceName}:${g.start}-${g.end})`
    }))
  }
  return (
    <SelectField
      name={name}
      label={label}
      infoText="Start gene selection by typing a HUGO symbol..."
      isLoading={isLoading && !!inputValue}
      options={options}
      onInputChange={onInputChange}
      control={control}
      errors={errors}
      register={register}
      className={className}
      useOptionsAsValue
      isClearable
    />
  )
}
