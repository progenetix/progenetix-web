import Select, { createFilter, components } from "react-select"
import { FixedSizeList as List } from "react-window"
import { useEffect } from "react"
import cn from "classnames"

export default function ControlledSelect({
  name,
  defaultValue,
  watch,
  setValue,
  register,
  rules = {},
  options = [],
  className,
  ...selectProps
}) {
  // We use this instead of the Controller to map the values. So [{value, label}] becomes [value]
  const formValue = watch(name)
  let selectValue
  if (Array.isArray(formValue)) {
    selectValue = options?.filter(({ value }) => formValue.includes(value))
  } else {
    selectValue = options?.filter(({ value }) => formValue === value)
  }

  const components =
    options?.length > 100 ? { MenuList: WindowMenuList, Option } : { Option }

  useEffect(() => {
    register({ name }, rules)
    setValue(name, defaultValue)
  }, [register])

  const handleChange = (v) => {
    let value
    if (Array.isArray(v)) {
      value = v.map(({ value }) => value)
    } else {
      value = v?.value
    }
    setValue(name, value)
  }
  return (
    <div className={cn(className)}>
      <Select
        filterOption={createFilter({ ignoreAccents: false })} // faster
        components={components}
        options={options ?? []}
        value={selectValue}
        onChange={handleChange}
        className="react-select-container"
        classNamePrefix="react-select"
        {...selectProps}
      />
    </div>
  )
}

const height = 35

// GREATLY improves performances
function WindowMenuList(props) {
  const { options, children, maxHeight, getValue } = props
  const [value] = getValue()
  const initialOffset = options.indexOf(value) * height

  return (
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  )
}

function Option(props) {
  const { innerProps, isFocused, ...otherProps } = props
  const { onMouseMove, onMouseOver, ...otherInnerProps } = innerProps
  const newProps = { innerProps: { ...otherInnerProps }, ...otherProps }
  return (
    <components.Option {...newProps} className="react-select__option">
      {props.children}
    </components.Option>
  )
}
