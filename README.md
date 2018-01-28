![alt text](https://raw.githubusercontent.com/rognstadragnar/aoudad/master/logo.png)

Just another state management library

## Motivation

Nobody thinks the JS community needs another state management library, so I made one to spite you all.

## Usage

```
npm install aoudad
```

### Initializing Aoudad

```Javascript
import { stateManager } from 'aoudad'

const initialState = {
  someValue: 'My value'
}

const actions = {
  setName: (state, dispatch) => {
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
const SomeComponent = ({ myValue }) => <h1>{myValue}</h1>

export default store.connect()(SomeComponent)
// Some component has access the whole state and all the actions in the store
```

#### Listening to just certain parts of the state tree

```Javascript
const SomeComponent = ({ myValue }) => <h1>{myValue}</h1>

function mapStateToProps(state) {
  return {
    myValue: state.something.i.care.about
  }
}

export default store.connect(mapStateToProps)(SomeComponent)
// Some component has access to myValue and all the actions in the store
```

#### Passing in certain actions

```Javascript
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

export default store.connect(null, mapActionsToProps)(SomeComponent)

/*
Some component has access to the whole state tree
and the setName and setUpperCaseName functions
*/
```

## License

[MIT](LICENSE).
