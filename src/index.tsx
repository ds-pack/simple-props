import * as CSS from 'csstype'

export type FindProp = (
  configuredProps: Array<string>,
  propName: string,
) => string | void

function defaultFindPropInPropConfig(
  configuredProps: Array<string>,
  propName: string,
): string | void {
  return configuredProps.find((prop) => {
    return prop === propName
  })
}

export type ToVariable = ({
  scale,
  value,
  props,
}: {
  scale: string
  value: any
  props: { [name: string]: any }
}) => string

function defaultToVariable({ scale, value }) {
  return `var(--${scale}-${value})`
}

interface Props {
  [name: string]:
    | (({
        prop,
        value,
        props,
      }: {
        prop: string
        value: string | number | object
        props: object
      }) => object)
    | { scale: string; property: string }
    | boolean
}

export type SimpleProps = (props: { [name: string]: any }) => CSS.Properties

export default function createSimpleProps({
  props: propConfig,
  findPropInPropConfig = defaultFindPropInPropConfig,
  toVariable = defaultToVariable,
}: {
  props: Props
  findPropInPropConfig?: FindProp
  toVariable?: ToVariable
}): SimpleProps {
  let configuredProps = Object.keys(propConfig)
  return function simpleProps(props) {
    let styles = {}
    for (let prop in props) {
      let foundProp = findPropInPropConfig(configuredProps, prop)
      if (foundProp) {
        let scale, property
        let resolvedConfig = propConfig[foundProp]
        if (typeof resolvedConfig === 'boolean') {
          scale = property = prop
        } else if (typeof resolvedConfig === 'function') {
          styles = {
            ...styles,
            ...resolvedConfig({
              prop,
              value: props[prop],
              props,
            }),
          }
        } else {
          scale = resolvedConfig.scale
          property = resolvedConfig.property
        }
        styles = {
          ...styles,
          [property]: toVariable({ scale, value: props[prop], props }),
        }
      }
    }
    return styles
  }
}
