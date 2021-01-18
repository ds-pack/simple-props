# `simple-props`

A fairly minimal style-props library for CSS-in-JS libraries or inline-styles
powered by CSS Variables (Custom Properties).

## Installation:

```sh
yarn add simple-props
```

## Usage:

```tsx
import createSimpleProps from 'simple-props'

let simpleProps = createSimpleProps({
  props: {
    // color="primary" // => color: var(--color-primary)
    color: true,
    // bg="primary" // => backgroundColor: var(--color-primary)
    bg: {
      property: 'backgroundColor',
      scale: 'color',
    },
  },
  pseudoProps: {
    _hover: '&:hover',
    _focus: '&:focus',
  },
  breakpoints: [200, 400, 800],
})

// Either pull in your favorite CSS-in-JS library...
import styled from 'styled-components'

let Box = styled('div')(simpleProps)

// or roll your own with inline-styles:
function Box(props) {
  let styles = simpleProps(props)
  return <div {...props} style={styles} />
}

// or use it to generate styles staticly:
let styles = simpleProps({
  _focus: {
    color: 'primary',
  },
  _hover: {
    color: 'secondary',
  },
  bg: 'white',
})
```

Supports:

- Generating static styles
- Pseudo-props for pseudo selectors
- Responsive prop values for different values at different breakpoints

### Tools:

- Typescript
- Babel
- Jest
