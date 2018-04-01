import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'mehdux/react'
import Header from '../components/Header'
import MainSection from '../components/MainSection'

const App = ({ todos, actions }) => {
  return (
    <div>
      <Header addTodo={actions.addTodo} />
      <MainSection todos={todos} actions={actions} />
    </div>
  )
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  todos: state
})

const mapActionsToProps = actions => ({
  actions
})

export default connect({ mapStateToProps, mapActionsToProps })(App)
