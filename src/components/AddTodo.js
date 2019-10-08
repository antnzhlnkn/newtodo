import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'

class AddTodo extends Component {
    static propTypes = {
        uid: PropTypes.string,
        isDone : PropTypes.bool.isRequired,
        firestore: PropTypes.shape({
            add: PropTypes.func.isRequired
        }).isRequired
    };
    state = { todo: '' };

    render() {
        if (!this.props.uid) return null

        return (
            <div>
                <input
                    type="text"
                    value={this.state.todo}
                    onChange={(evt) => this.setState({ todo: evt.target.value })}
                />
                <button onClick={() => this.addTodo()}>Add Todo</button>
            </div>
        )
    }
    addTodo() {
        this.props.firestore.add(
            { collection: 'todos' },
            {
                uid: this.props.uid,
                name: this.state.todo,
                isDone : this.props.isDone
            }
        )
        this.setState({ todo: '' })
    }
}

const mapStateToProps = state => {
    return {
        uid: state.firebase.auth.uid,
        isDone: false
    }
}

const mapDispatchToProps = {}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(),
)(AddTodo)