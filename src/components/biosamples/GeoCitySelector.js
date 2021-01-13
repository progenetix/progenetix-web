import { useAsyncSelect } from "../../hooks/asyncSelect"
import { useGeoCity } from "../../hooks/api"
import SelectField from "../form/SelectField"
import React from "react"

export function GeoCitySelector({
  name,
  label,
  control,
  errors,
  register,
  className
}) {
  const { inputValue, onInputChange } = useAsyncSelect()
  const { data, isLoading } = useGeoCity({ city: inputValue })
  let options = []
  if (data) {
    options = data.response.results.map((g) => ({
      value: g,
      data: g,
      label: `${g.city} (${g.country})`
    }))
  }
  return (
    <SelectField
      name={name}
      label={label}
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
