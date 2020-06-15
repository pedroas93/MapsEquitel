import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classNames from 'classnames';

class Task extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.deleteThisTask = this._deleteThisTask.bind(this);
        this.toggleCheked = this._toggleCheked.bind(this);
        this.togglePrivate = this._togglePrivate.bind(this);
    }
    _toggleCheked() {
        const { task } = this.props;
        Meteor.call('tasks.setChecked', task._id, !task.checked);
    }

    _deleteThisTask() {
        const { task } = this.props;
        Meteor.call('tasks.remove', task._id);
    }

    _togglePrivate(){
        const {task} = this.props;
        Meteor.call('tasks.setPrivate', task._id, !task.checked); 
    }

    render() {
        const { task, showPrivateButton } = this.props;
        const taskClassName = classNames({
            checked: task.checked,
            private: task.private,
          });
        return (
            <li className={taskClassName}>
                <button className="delete" onClick={this.deleteThisTask}>
                    &times;
                </button>

                <input type="checkbox" readOnly checked={!!task.checked}
                    onClick={this.toggleCheked}
                />


                {showPrivateButton ? (
                    <button className="toggle-private" onClick={this.togglePrivate}>
                        {task.private ? 'Private' : 'Public'}
                    </button>
                ) : null}

                <span className="text"> <strong>{task.username}</strong>: {task.restauranName} / {task.restaurantLat} /{task.restaurantLng} / {task.restaurantType}/ {task.restaurantComment}/ {task.restauranScore}</span>
            </li>
        )
    }
}

export default Task;