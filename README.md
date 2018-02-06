<div align="center">
  <img src="https://raw.githubusercontent.com/rognstadragnar/aoudad/master/mehdux.png" alt="mehdux">
</div>

# mehdux

> Just another tiny, simple state machine

* Easy to grasp API
* Tiny: 577 bytes gzipped
* Small React and Preact integrations (~750 bytes gzipped)
* WordArt logo

## Motivation

Nobody thinks the JS community needs another state management library, so I made one to spite you all.

## Usage

```
npm install mehdux
```

### Initializing mehdux

```Javascript
import { stateManager } from 'mehdux'

const initialState = {
  someValue: 'My value'
}

const actions = {
  // ...actions
}

const store = stateManager(initialState, actions)
```

#### Creating and using actions
The actions you create should be a function that takes the state and returns a function returning the new state.

```Javascript
const add = state => value => ({
  ...state,
  value: state.value + value
})

// or without arrow functions
const subtract = function(state) {
  return function(value) {
    return {
      ...state,
      value: state.value - value
    }
  }
}

const actions = { increment, decrement }
```
`Mehdux` transforms the actions you pass the store.
 Using the actions simply looks like this:

```Javascript
store.actions.add(10)
store.actions.subtract(20)
```
### Subscribe to state changes

```Javascript
store.connect()(console.log)

store.actions.setValue('A cooler value')
// logs { someValue: 'A cooler Value' }

```

To subscribe to changes in certain parts of the state tree you can pass a function as the first argument to the `connect`-function. This is similiar to how you map state to props in `react-redux`.

```Javascript

const mapState = state => ({
  interesting: state.something
})

store.connect(mapState)(console.log)

store.actions.setSomething('This is interesting')
// logs { interesting: 'This is interesting' }

```

### Usage with other frameworks
`Mehdux` has built-in integrations with `react` and `preact`.

Simply import the `connect`-function, pass it the store you have already created and pass your component to the returning function.
```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact

const SomeComponent = ({ myValue }) => <h1>{myValue}</h1>

export default connect(store)(SomeComponent)
// Some component has access the whole state and all the actions in the store
```

#### Listening to just certain parts of the state tree
Often you only care about a few parts of your state tree in a component. By only passing in those properties you will improve the performance of your application.

To achieve this you want to create a `mapActionsToProps`-function. This function gets passed the entire state and should return an object containing the properties you care about. Pass this as the second argument to the `connect`-function.

Doing this is optional and you can pass in nothing or `null`, but it is strongly encouraged.
```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact

const SomeComponent = ({ myValue }) => <h1>{myValue}</h1>

function mapStateToProps(state) {
  return {
    myValue: state.something.i.care.about
  }
}

export default connect(store, mapStateToProps)(SomeComponent)
// Some component has access to myValue and all the actions in the store
```

#### Passing in certain actions
Similarly you can use a `mapActionsToProps`-function to only pass the actions you care about to your component.

This function gets passed all the actions in the store and should return an object containing the actions you care about. Pass this as the third argument to the `connect`-function.

```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact'

const SomeComponent = ({ myValue }) => <h1>{myValue}</h1>

function mapActionsToProps(actions) {
  return {
    setName: actions.setName,
    setUpperCaseName: (value) => actions.setName(value.toUpperCase())
  }
}

export default connect(store, null, mapActionsToProps)(SomeComponent)

/*
Some component has access to the whole state tree
and the setName and setUpperCaseName functions
*/
```

#### Dispatching async thunk-like actions
`Mehdux` has support for dispatching actions within actions.
All actions you create also gets passed a `dispatch`-function.

To dispatch simply pass the name of the action (the object property) as the first argument. Subsequent arguments gets passed to the action.


```Javascript
const actions = {
  setName: state => {
    return value => ({
      ...state,
      someValue: value
    })
  },
  fetchAndSetName: async (state, dispatch) => {
    const res = await fetch('https://myapi.com/v0')
    const data = await res.json()
    dispatch('setName', data.name)
  }
}
```

## License

[MIT](LICENSE).
