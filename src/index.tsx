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
  [name: string]:
    | { scale: string; property: string }
    | { scale: string; properties: Array<string> }
    | boolean
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

export type SimpleProps = (props: {
  [name: string]: any
}) => { [key: string]: string }

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
        let scale,
          properties = []
        let resolvedConfig = propConfig[prop]
        if (typeof resolvedConfig === 'boolean') {
          scale = prop
          properties.push(prop)
        } else {
          scale = resolvedConfig.scale
          // @ts-ignore
          properties = resolvedConfig.properties || [resolvedConfig.property]
        }
        if (typeof propValue === 'object' && propValue != null) {
          // _, 360
          let queries = Object.keys(propValue).sort(sortByAllFirst)
          styles = queries.reduce((newStyles, query) => {
            let tokenMatch =
              // This value could be a number which doesn't support `.match`
              typeof propValue[query] === 'string'
                ? propValue[query].match(/\$([^\s]+)/)
                : null
            let tokenValue =
              tokenMatch && tokenMatch.length > 0 ? tokenMatch[1] : null
            if (query === '_') {
              return {
                ...newStyles,
                ...properties.reduce(
                  (sty, property) => ({
                    ...sty,
                    [property]: tokenValue
                      ? toVariable({
                          scale,
                          value: tokenValue,
                          props,
                          breakpoint: query,
                        })
                      : propValue[query],
                  }),
                  {},
                ),
              }
            }
            let queryKey = createMediaQuery({ query })
            return {
              ...newStyles,
              [queryKey]: {
                ...(newStyles[queryKey] || {}),
                ...properties.reduce(
                  (sty, property) => ({
                    ...sty,
                    [property]: tokenValue
                      ? toVariable({
                          scale,
                          value: tokenValue,
                          props,
                          breakpoint: query,
                        })
                      : propValue[query],
                  }),
                  {},
                ),
              },
            }
          }, styles)
        } else {
          let tokenMatch =
            // This value could be a number which doesn't support `.match`
            typeof propValue === 'string' ? propValue.match(/\$([^\s]+)/) : null
          let tokenValue =
            tokenMatch && tokenMatch.length > 0 ? tokenMatch[1] : null
          // non-responsive prop values
          styles = {
            ...styles,
            ...properties.reduce(
              (sty, property) => ({
                ...sty,
                [property]: tokenValue
                  ? toVariable({
                      scale,
                      value: tokenValue,
                      props,
                      breakpoint: '_',
                    })
                  : propValue,
              }),
              {},
            ),
          }
        }
      }
    }
    return styles
  }
}
