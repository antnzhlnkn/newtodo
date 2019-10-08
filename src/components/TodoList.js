import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'

import AddTodo from './AddTodo'

class TodoList extends Component {
    static propTypes = {
        uid: PropTypes.string,
        todos: PropTypes.arrayOf(PropTypes.object),
        selectedTodo: PropTypes.object,
        selectTodo: PropTypes.func.isRequired,
        completedTodo: PropTypes.oneOfType([
            PropTypes.object.isRequired,
            PropTypes.oneOf(null).isRequired,
        ]).isRequired,
        completTodo: PropTypes.func.isRequired,
        firestore: PropTypes.shape({
            set: PropTypes.func.isRequired
        }).isRequired
    }
    renderTodo(todo) {
        const styles = {
            padding: '1rem',
            cursor: 'pointer'
        }
        if (todo === this.props.selectedTodo) {
            styles.backgroundColor = '#988afe'
        }
        return (
            <div
                key={todo.name}
                style={styles}
                onClick={() => this.props.selectTodo(todo)}>
                {todo.name}
                <input
                    type="checkbox"
                    checked={todo.isDone}
                    onChange={() => this.props.completTodo(todo)}
                />
            </div>
        )
    }
    render() {
        const todoItems = this.props.todos.map(
            (item) => this.renderTodo(item)
        )
        return (
            <div>
                <div>
                    {todoItems}
                </div>
                {this.props.completedTodo ? <button onClick={()=>this.saveTodos()}>Save</button> : null}
                <AddTodo />
                {console.log(this.props.completedTodo)}
                {this.props.completedTodo ? console.log(this.props.completedTodo.id) : null}
            </div>
        )
    }
    saveTodos() {
        this.props.firestore.collection('todos')
            .doc(this.props.completedTodo.id)
            .set(
                {
                    name: this.props.completedTodo.name,
                    isDone: this.props.completedTodo.isDone,
                    uid: this.props.completedTodo.uid
                }
            );
    }
}
const mapStateToProps = state => {
    return {
        uid: state.firebase.auth.uid,
        todos: state.firestore.ordered.todos ? state.firestore.ordered.todos : [],
        selectedTodo: state.todos.selectedTodo,
        completedTodo :state.todos.completedTodo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectTodo: todo => dispatch({ type: 'selectTodo', todo }),
        completTodo: todo => dispatch ({ type: 'completTodo', todo})
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => {
            if (!props.uid) return []
            return [
                {
                    collection: 'todos',
                    where: [
                        ['uid', '==', props.uid]
                    ]
                }
            ]
        }
    )
)(TodoList)