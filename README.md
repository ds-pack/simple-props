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
    p({ prop, value, props }) {
      return {
        paddingLeft: `var(--space-${value})`,
        paddingRight: `var(--space-${value})`,
        paddingBottom: `var(--space-${value})`,
        paddingTop: `var(--space-${value})`,
      }
    },
  },
})

// Either pull in your favorite CSS-in-JS library...
import styled from 'styled-components'

let Box = styled('div')(simpleProps)

// or roll your own with inline-styles:
function Box(props) {
  let styles = simpleProps(props)
  return <div {...props} style={styles} />
}
```

### Tools:

- Typescript
- Babel
- Jest
