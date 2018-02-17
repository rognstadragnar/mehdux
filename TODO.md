# Todo
Send actions to each action, instead of a dispatch function.
```Javascript
const actions = {
  add: (state, actions) => () => {
    allActions.remove('asd')
  }
}
```




Ensure immutability?
```Javascript
const actions = {
  add: state => () => ({
    partialState: 'will get merged'
  })
}
```