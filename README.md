<div align="center">
  <img src="https://raw.githubusercontent.com/rognstadragnar/aoudad/master/mehdux.png" alt="mehdux">
  <br>
  <a href="https://www.npmjs.org/package/mehdux">
    <img src="https://img.shields.io/npm/v/mehdux.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.org/package/mehdux">
    <img src=https://img.shields.io/npm/dt/mehdux.svg alt="npm download counter">
  </a>
  
</div>

# mehdux 🐧

> Just another tiny, simple state machine

* 💆 Easy to grasp API
* 🐎 ~1kb: Tiny, small, slim, light, slender, fit
* ⚛️ Small React (~850 bytes), Preact (~800 bytes) and Picodom (~200 bytes) integrations
* 😌 Support for `thunk actions`, `middlewares`, `combining stores`
* 🛂 Written in `TypeScript`
* 🎉 WordArt logo
* 🌞 Emojis in README.md

## Motivation

Nobody thinks the JS community needs another state management library, so I made one to spite you all.

## Examples

* [TodoMVC](examples/todomvc)

## Usage

```
npm install mehdux
```

### Initializing mehdux

```Javascript
import { Store } from 'mehdux'

const initialState = {
  value: 0
}

const actions = {
  // ...
}

const store = new Store(initialState, actions)
```

#### Creating and using actions

The actions you create should be a function that takes the state and returns a function returning the new state.

```Javascript
const actions = {
  inc: state => value => ({
    ...state,
    value: state.value + value
  }),
  dec: state => value => ({
    ...state,
    value: state.value - value
  })
}
```

`Mehdux` transforms the actions you pass the store.
Using the actions simply looks like this:

```Javascript
store.actions.inc(1)
```

### Subscribe to state changes

To subscribe to state changes you use the `connect`-function on the `store` instance you have already created.

On a state change the subscriber gets invoked with the state tree as the first argument and the actions as the second argument.

```Javascript
store.connect()(console.log)

store.actions.inc(10)
// logs { value: 10 }, { inc: f(), dec: f() }
```

The `connect` function can take an object containing the following options:
`mapStateToProps`, `mapActionsToProps`, `leading` and `force`. All of these properties are optional.

#### MapStateToProps

Enables you to only subscribe to certain parts of the state tree. This should be a function that takes state as an argument and returns an object.

On every state update this function will be called. If the result is different from the last state update, the connected function will be called.

```Javascript
const mapStateToProps = ({ something, somethingElse }) => ({
  something,
  somethingElse
})

store.connect({ mapStateToProps })(console.log)
```

This is very similiar to how you mapping state to props in `react-redux` works.
If `null` is passed, the conneciton will not get any state updates.

#### MapActionsToProps

Works in the same way `mapStateToProps` works, enabling you to only pass certain actions to you connected function.

```Javascript
const mapActionsToProps = actions => ({
  inc: actions.inc,
  increaseByTen: () => actions.inc(10),
})

store.connect({ mapActionsToProps })(console.log)
```

Notice how this enables you to preset an action like the `increaseByTen` demonstrates above.
If `null` is passed, the conneciton will not get any actions passed.

#### Leading

The `leading` option is an optional `boolean` that tells the store whether or not to execute the connected function on the time of connection.
`Default: false`

#### Force

The `force` option is also an optional `boolean` that tells the store to execute the connected function on every action, eventhough the state did not change.
`Default: false`

## Usage with other frameworks

`Mehdux` has built-in integrations with `react`, `preact` and `picodom`.

### React and Preact

To connect a component to the store you need to wrap the component in the `connect`-function from `mehdux`.

```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact'
```

There are two ways to pass the store to the `connect`-function in `mehdux`:

1.  By wrapping your app in a higher order `provider`-function like, similiar to how `react-redux` does it.
2.  Passing the store in the options object to the `connect` function.

#### 1. By using a Provider

```Javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'mehdux/react' // or 'mehdux/preact'
import { store } from './store' // or wherever you keep your store instance


const Button = ({ state, actions }) => {
  return <button onClick={actions.inc}>{state.value}</button>
}

const ConnectedButton = connect()(Button)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedButton />
  </Provider>,
  document.getElementById('root')
)
```

#### 2. By passing in the store instance

```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact'
import { store } from './store' // or wherever you keep your store instance


const Button = ({ state, actions }) => {
  return <button onClick={actions.inc}>{state.value}</button>
}

const ConnectedButton = connect({ store })(Button)
```

### Picodom

`Mehdux` exports a tiny, small, slender, light, fit `connect`-function for easy stateful components in Picodom.

#### Regular usagage

A typical Picodom and Mehdux app might look like this:

```Javascript
// @jsx h
import { h, patch } from 'picodom'
import { store } from './store' // or wherever you keep your store instance

let node = null

const render = viewFn => (state, actions) => {
  patch(node, (node = viewFn(state, actions)), root);
};

const view = (state, actions) => {
  return <button onClick={actions.inc}>{state.value}</button>
}

store.connect()(render(view))
```

Out of the box stateful components connected to a store is not straight-forward with `Picodom`.
To make connected components in `Picodom` a breeze `Mehdux` comes with a small `connect`-function.

Here is how to do it:

```Javascript
// @jsx h
import { h, patch } from 'picodom'
import { connect } from 'mehdux/picodom'
import { store } from './store' // or wherever you keep your store instance

let node = null

// Note the storeInstance that gets passed to 'render' from 'store.connect'
const render = viewFn => (state, actions, storeInstance) => {
  patch(node, (node = viewFn(state, actions, storeInstance)), root);
};

const Button = ({ actions, state }) => {
  return <button onClick={actions.inc}>{state.value}</button>
}

const ConnectedButton = connect()(Button)

const view = (state, actions, storeInstance) => {
  return (
    <div>
      <ConnectedButton store={storeInstance} />
    </div>
  )
}

// Note the third argument to connect, which forces the store to emit even on equal states.
// This is to enable the stateful components inside `view` to get rerun,
// eventhough the parent state does not change.

store.connect({ leading: true, force: true })(render(view))
```

**Note:** _This implementation will likely be rewritten to be more similiar to the `React`/`Preact`-implementations_

## Advanced usage

### Dispatching multiple or async actions

`Mehdux` has support for dispatching actions within actions.
You have access to other actions within an action.

To dispatch simply execute the action you want.

```Javascript
const actions = {
  addUser: state => user => ({
    ...state,
    user: [...state.users, user]
  }),
  addManyUsers: state => () => {
    actions.addUser('Kari')
    actions.addUser('Ola')
  },
  addUserIn2s: (state, actions) => user => {
    setTimeout(() => actions.addUser(user), 2000)
  },
  fetchAndSetName: (state, actions) => async () => {
    const res = await fetch('https://myapi.com/v0')
    const user = await res.json()
    actions.addUser(user)
  }
}
```

### Middleware/Enhancers

`Store` takes a third argument along side `initialState` and `actions`. This is an array of middleware-functions. Each middleware gets called on actions being called on the store.

They recieve the action `name`, `arguments`, `currentState` and `nextState`.

Logging and analytics are examples of middleware usages.

`mehdux/utils` includes a helper function for applying middlewares, but you are free to just pass an `array` as well.

```Javascript
import { Store } from 'mehdux'
import { applyMiddleware } from 'mehdux/utils'
import { Logger, Analytics } from './middlewares' // or wherever you keep your middlewares

const store = new Store({}, {}, applyMiddleware(Logger, Analytics)

export { store }
```

### Combining multiple store instances

Bigger apps often have complex state trees. In `redux` you would handle this by combining reducers. With `Mehdux` you can combine stores with the `combineStores`-function from `mehdux/utils` like so:

```Javascript
import { combineStores } from 'mehdux/utils'

const store = combineStores({
  users: userStore,
  posts: postStore
}, /* myMiddleware */)
```

By default combineStores does not copy the middlewares for each sub-store. And you need to apply the middlewares as the second argument.
However, if you want to copy the original middlewares past to the store you can by passing `true` as the second argument to `combineStores`.

## Todos

* Tests
* Sort out type-definitions when using `microbundle`

## License

[MIT](LICENSE).
