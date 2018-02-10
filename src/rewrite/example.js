import { Store } from './main.ts'

const initialState = {
  users: ['James Bond']
}

const actions = {
  addUser: state => user => ({
    ...state,
    users: [...state.users, user]
  }),
  removeUser: state => user => ({
    ...state,
    users: state.users.filter(u => u !== user)
  }),
  asyncAddUser: state => async () => {
    const res = await fetch('https://some.api')
    const user = await res.json()
    return {
      ...state,
      users: [...state.users, user]
    }
  },
  addLoadsOfUsers: (state, dispatch) => (...users) => {
    users.forEach(user => dispatch('addUser', user))
  }
}

const store = new Store()
store.connect()(console.log)
store.actions.addUser('M')
store.actions.addLoadsOfUsers('X', 'Y', 'Z')
/* logs => "{ users: ['Tom', 'Jerry'] }" */