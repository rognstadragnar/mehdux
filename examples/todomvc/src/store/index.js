import { Store } from 'mehdux'

const initialState = [
  {
    text: 'Use Mehdux',
    completed: false,
    id: 0
  }
]

const actions = {
  addTodo: state => text => [
    ...state,
    {
      id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
      completed: false,
      text: text
    }
  ],
  deleteTodo: state => id => state.filter(todo => todo.id !== id),
  editTodo: state => ({ id, text }) =>
    state.map(todo => (todo.id === id ? { ...todo, text: text } : todo)),
  completeTodo: state => id =>
    state.map(
      todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)
    ),
  completeAll: state => () => {
    const areAllMarked = state.every(todo => todo.completed)
    return state.map(todo => ({
      ...todo,
      completed: !areAllMarked
    }))
  },
  clearCompleted: state => () => state.filter(todo => todo.completed === false)
}

const store = new Store(initialState, actions)

export { store }
