![alt text](https://raw.githubusercontent.com/rognstadragnar/aoudad/master/mehdux.png)

# mehdux

Just another state management library

## Motivation

Nobody thinks the JS community needs another state management library, so I made one to spite you all.

## Todo

1. Fix connect for Preact/React components

* Be able to pass in store or use context or provider

2. Less fancy JS -> smaller bundle

## Usage (soon™)

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
  setName: state => {
    return value => ({
      ...state,
      someValue: value
    })
  }
}

const store = stateManager(initialState, actions)
```

### Subscribe to state changes

```Javascript
store.subscribe(console.log)

store.actions.setValue('A cooler value')
// logs { someValue: 'A cooler Value' }
```

### Usage with other frameworks

```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact

const SomeComponent = ({ myValue }) => <h1>{myValue}</h1>

export default connect(store)(SomeComponent)
// Some component has access the whole state and all the actions in the store
```

#### Listening to just certain parts of the state tree

```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact

const SomeComponent = ({ myValue }) => <h1>{myValue}</h1>

function mapStateToProps(state) {
  return {
    myValue: state.something.i.care.about
  }
}

export default connect(state, mapStateToProps)(SomeComponent)
// Some component has access to myValue and all the actions in the store
```

#### Passing in certain actions

```Javascript
import { connect } from 'mehdux/react' // or 'mehdux/preact'

const SomeComponent = ({ myValue }) => <h1>{myValue}</h1>

function mapStateToProps(state) {
  return {
    myValue: state.something.i.care.about
  }
}

function mapActionsToProps(actions) {
  return {
    setName: actions.setName,
    setUpperCaseName: (value) => actions.setName(value.toUpperCase())
  }
}

export default store.connect(store, null, mapActionsToProps)(SomeComponent)

/*
Some component has access to the whole state tree
and the setName and setUpperCaseName functions
*/
```

#### Dispatching async thunk-like actions

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
