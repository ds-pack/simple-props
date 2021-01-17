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
