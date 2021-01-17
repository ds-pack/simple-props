import React, { forwardRef } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import createSimpleProps from 'simple-props'

// @TODO:
// - Support pseudos from system-props

// Implementation Detail
let cssVars = [
  ['--color-primary', 'cornflowerblue'],
  ['--color-secondary', 'mediumspringgreen'],
  ['--space-0', '0px'],
  ['--space-1', '4px'],
  ['--space-2', '8px'],
]

// Implementation Detail
let Global = createGlobalStyle`
  :root {
    ${cssVars.map((token) => `${token[0]}: ${token[1]}`).join(';\n')}
  }
  html, body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
`

// Implementation details
let propConfig = {
  color: true,
  backgroundColor: {
    scale: 'color',
    property: 'backgroundColor',
  },
  bg: {
    scale: 'color',
    property: 'backgroundColor',
  },
  p: {
    scale: 'space',
    property: 'padding',
  },
  variant({ prop, value, props }) {
    if (value === 'primary') {
      return {
        color: `var(--color-primary)`,
        backgroundColor: `var(--color-secondary)`,
        borderRadius: '4px',
        padding: `var(--space-2)`,
        border: 'none',
      }
    }
    return {}
  },
}

// Implementatiopn details
let InnerBox = forwardRef(function InnerBox(
  { is: Element = 'div', ...rest },
  ref,
) {
  let props = {}
  for (let propName in rest) {
    if (propName in propConfig) {
      continue
    }
    props[propName] = rest[propName]
  }
  return <Element ref={ref} {...props} />
})

// Implementatiopn details
let Box = styled(InnerBox)(
  createSimpleProps({
    props: propConfig,
  }),
)

// WHATTTT????????? 🤯🤯🤯🤯🤯
let simpleProps = createSimpleProps({
  props: propConfig,
})

let StylesBox = forwardRef(function StylesBox(props, ref) {
  let styles = simpleProps(props)
  return <InnerBox ref={ref} {...props} style={styles} />
})
// end

export default function App() {
  return (
    <div className="App">
      <Global />
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Box is="p" color="primary" bg="secondary" p={2}>
        Testing
      </Box>
      <StylesBox is="p" color="secondary" bg="primary" p={1}>
        Inline Styles???
      </StylesBox>

      <StylesBox is="button" variant="primary">
        Testing
      </StylesBox>
    </div>
  )
}
