<div align="center">
  <img src="https://raw.githubusercontent.com/rognstadragnar/aoudad/master/mehdux.png" alt="mehdux">
</div>

# mehdux

> Just another tiny, simple state machine

* Easy to grasp API
* 686 bytes: Tiny, small, slim, light, slender, fit
* Small React (538 bytes), Preact (457 bytes) and Picodom (210 bytes) integrations
* WordArt logo
* Emojis in README.md (Todo !important)

## Motivation

Nobody thinks the JS community needs another state management library, so I made one to spite you all.

## Usage

```
npm install mehdux
```

### Initializing mehdux

```Javascript
import { store } from 'mehdux'

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

To subscribe to changes in certain parts of the state tree you can pass a function as the first argument to the `connect`-function. This is similiar to how you map state to props in `react-redux`.

```Javascript
const mapStateToProps = ({ something, somethingElse }) => ({
  something,
  somethingElse
})

store.connect(mapStateToProps)(console.log)
```

Similiarly you can pass in a `mapActionsToProps`-function as the second argument to the `connect`-function.

```Javascript
const mapActionsToProps = actions => ({
  inc: actions.inc,
  increaseByTen: () => actions.inc(10),
})

store.connect(null, mapActionsToProps)(console.log)
```

Passing `null` as either the first or second argument passes the state or the actions object in its entirety.

## Usage with other frameworks

`Mehdux` has built-in integrations with `react`, `preact` and `picodom`.

### React and Preact

To connect a component to the store you need to wrap the component in the `connect`-function from `mehdux`.

```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact'
```

There are two ways to pass the store to the `connect`-function in `mehdux`:

1. By wrapping your app in a higher order `provider`-function like, similiar to how `react-redux` does it.
2. Passing the store as the first argument to the `connect`-function.

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

const ConnectedButton = connect(store)(Button)
```

**Note:** _When doing this, `mapStateToProps` and `mapActionsToProps` are passed as the second and third arguments, not the first and the second like usual_

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

store.connect(null, null, true)(render(view))
```

**Note:** _This implementation will likely be rewritten to be more similiar to the `React`/`Preact`-implementations_

## Advanced usage

### Dispatching multiple or async actions

`Mehdux` has support for dispatching actions within actions.
All actions you create also gets passed a `dispatch`-function.

To dispatch simply pass the name of the action (the object property) as the first argument. Subsequent arguments gets passed to the action.

```Javascript
const actions = {
  addUser: state => user => ({
    ...state,
    user: [...state.users, user]
  }),
  addManyUsers: state => () => {
    dispatch('addUser', 'Kari')
    dispatch('addUser', 'Ola')
  },
  addUserIn2s: (state, disaptch) => user => {
    setTimeout(() => dispatch('addUser', user), 2000)
  },
  fetchAndSetName: async (state, dispatch) => {
    const res = await fetch('https://myapi.com/v0')
    const user = await res.json()
    dispatch('addUser', user)
  }
}
```

### Combining multiple store instances (WIP)

Bigger apps often have complex state trees. In `redux` you would handle this by combining reducers. With `Mehdux` you can combine stores with the `combineStores`-function like so:

```Javascript
import { combineStores } from 'mehdux/combine'

const store = combineStores({ users: userStore, posts: postStore })
```

### Middleware/Enhancers

`Store` takes a third argument along side `initialState` and `actions`. This is an array of middleware-functions. Each middleware gets called on actions being called on the store.

They recieve the action `name`, `arguments`, `currentState` and `nextState`.

Logging and analytics are examples of middleware usages.

```Javascript
import { Store } from 'mehdux'
import { Logger, Analytics } from './middlewares' // or wherever you keep your middlewares

const store = new Store({}, {}, [Logger, Analytics])

export { store }
```

## Todos

* Emojis in README.md (Todo !important)
* Sort out type-definitions when using `microbundle`

## License

[MIT](LICENSE).
