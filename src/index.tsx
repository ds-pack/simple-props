import * as CSS from 'csstype'

export type ToVariable = ({
  scale,
  value,
  props,
  breakpoint,
}: {
  scale: string
  value: any
  props: { [name: string]: any }
  breakpoint: string | number
}) => string

function defaultToVariable({ scale, value }) {
  return `var(--${scale}-${value})`
}

interface Props {
  [name: string]: { scale: string; property: string } | boolean
}
export interface PseudoProps {
  [name: string]: string
}

export type CreateMediaQuery = ({ query }: { query: string }) => string

function defaultCreateMediaQuery({
  query,
}: {
  query: string | number
}): string {
  // @ts-ignore
  let appendPx = typeof query === 'number' || Number(query) == query
  let units = appendPx ? 'px' : ''
  return `@media screen and (min-width: ${query}${units})`
}

function sortByAllFirst(a: string, b: string): number {
  if (a === '_') {
    return -1
  } else if (b === '_') {
    return 1
  } else {
    // @ts-ignore
    return a - b
  }
}

export type SimpleProps = (props: { [name: string]: any }) => CSS.Properties

export default function createSimpleProps({
  props: propConfig,
  pseudoProps: pseudoConfig = {},
  toVariable = defaultToVariable,
  createMediaQuery = defaultCreateMediaQuery,
}: {
  props: Props
  pseudoProps?: PseudoProps
  toVariable?: ToVariable
  createMediaQuery?: CreateMediaQuery
}): SimpleProps {
  return function simpleProps(props) {
    let styles = {}
    // color="primary" p={{_: 0, 360: 4}}
    for (let prop in props) {
      // prop === "color" or prop === "p"
      let propValue = props[prop]
      let isSimpleProp = prop in propConfig
      let isPseudoSimpleProp = prop in pseudoConfig

      if (isPseudoSimpleProp) {
        // prop === _hover
        // propValue === { color: 'primary' }
        // @TODO? Responsive pseudo props?
        let rawPseudo = pseudoConfig[prop]
        let pseudoStyles = simpleProps(propValue)

        styles = {
          ...styles,
          [rawPseudo]: pseudoStyles,
        }
      }

      if (isSimpleProp) {
        let scale, property
        let resolvedConfig = propConfig[prop]
        if (typeof resolvedConfig === 'boolean') {
          scale = property = prop
        } else {
          scale = resolvedConfig.scale
          property = resolvedConfig.property
        }
        if (typeof propValue === 'object' && propValue != null) {
          // _, 360
          let queries = Object.keys(propValue).sort(sortByAllFirst)
          styles = queries.reduce((newStyles, query) => {
            let tokenMatch = propValue[query].match(/\$([^\s]+)/)
            let tokenValue =
              tokenMatch && tokenMatch.length > 0 ? tokenMatch[1] : null
            if (query === '_') {
              return {
                ...newStyles,
                [property]: tokenValue
                  ? toVariable({
                      scale,
                      value: tokenValue,
                      props,
                      breakpoint: query,
                    })
                  : propValue[query],
              }
            }
            let queryKey = createMediaQuery({ query })
            return {
              ...newStyles,
              [queryKey]: {
                ...(newStyles[queryKey] || {}),
                [property]: tokenValue
                  ? toVariable({
                      scale,
                      value: tokenValue,
                      props,
                      breakpoint: query,
                    })
                  : propValue[query],
              },
            }
          }, styles)
        } else {
          let tokenMatch = propValue.match(/\$([^\s]+)/)
          let tokenValue =
            tokenMatch && tokenMatch.length > 0 ? tokenMatch[1] : null
          // non-responsive prop values
          styles = {
            ...styles,
            [property]: tokenValue
              ? toVariable({
                  scale,
                  value: tokenValue,
                  props,
                  breakpoint: '_',
                })
              : propValue,
          }
        }
      }
    }
    return styles
  }
}
