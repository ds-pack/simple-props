import createSimpleProps from '../index'

test('createSimpleProps returns a function', () => {
  let props = {
    color: true,
  }
  let simpleProps = createSimpleProps({ props })

  expect(typeof simpleProps).toEqual('function')
})

test('it generates a styles object when called with props', () => {
  let propConfig = {
    color: true,
  }
  let simpleProps = createSimpleProps({ props: propConfig })

  let styles = simpleProps({ color: 'primary' })

  expect(styles).toMatchInlineSnapshot(`
    Object {
      "color": "var(--color-primary)",
    }
  `)
})

test('supports creating your own variables', () => {
  let propConfig = {
    color: true,
  }
  let simpleProps = createSimpleProps({
    props: propConfig,
    toVariable({ scale, value }) {
      return `var(--DS-${scale}-${value})`
    },
  })

  let styles = simpleProps({ color: 'primary' })

  expect(styles).toMatchInlineSnapshot(`
    Object {
      "color": "var(--DS-color-primary)",
    }
  `)
})

test('supports pseudo props', () => {
  let simpleProps = createSimpleProps({
    props: {
      color: true,
    },
    pseudoProps: {
      _hover: '&:hover',
    },
  })

  let styles = simpleProps({
    color: 'primary',
    _hover: {
      color: 'secondary',
    },
  })

  expect(styles).toMatchInlineSnapshot(`
    Object {
      "&:hover": Object {
        "color": "var(--color-secondary)",
      },
      "color": "var(--color-primary)",
    }
  `)
})

test('supports responsive props', () => {
  let simpleProps = createSimpleProps({
    props: {
      color: true,
    },
    breakpoints: [200, 400, 800],
  })

  let styles = simpleProps({
    color: {
      _: 'primary',
      200: 'secondary',
      800: 'white',
    },
  })

  expect(styles).toMatchInlineSnapshot(`
    Object {
      "@media screen and (min-width: 200px)": Object {
        "color": "var(--color-secondary)",
      },
      "@media screen and (min-width: 800px)": Object {
        "color": "var(--color-white)",
      },
      "color": "var(--color-primary)",
    }
  `)
})

test('supports custom media queries for responsive props', () => {
  let simpleProps = createSimpleProps({
    props: {
      color: true,
    },
    breakpoints: [200, 400, 800],
    createMediaQuery({ query }) {
      return `@media screen and (max-width: ${query}px)`
    },
  })

  let styles = simpleProps({
    color: {
      _: 'primary',
      200: 'secondary',
      800: 'white',
    },
  })

  expect(styles).toMatchInlineSnapshot(`
    Object {
      "@media screen and (max-width: 200px)": Object {
        "color": "var(--color-secondary)",
      },
      "@media screen and (max-width: 800px)": Object {
        "color": "var(--color-white)",
      },
      "color": "var(--color-primary)",
    }
  `)
})
