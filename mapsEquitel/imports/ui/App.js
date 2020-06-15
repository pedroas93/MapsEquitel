import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks';
import Task from './Task';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import Maps from "./Maps"

class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false

    }
  }

  componentDidMount() {
    this.handleSubmit = this._handleSubmit.bind(this);
    this.toggleHideCompleted = this._toggleHideCompleted(this);
  }

  _handleSubmit(event) {
    event.preventDefault();

    const restauranNameInput = ReactDOM.findDOMNode(this.refs.restaurantName);
    const restauranName = restauranNameInput.value.trim();
    const restaurantLatInput = ReactDOM.findDOMNode(this.refs.restaurantLat);
    const restaurantLat = restaurantLatInput.value.trim();
    const restaurantLngInput = ReactDOM.findDOMNode(this.refs.restaurantLng);
    const restaurantLng = restaurantLngInput.value.trim();
    const restaurantTypeInput = ReactDOM.findDOMNode(this.refs.restaurantType);
    const restaurantType = restaurantTypeInput.value.trim();
    const restaurantCommentInput = ReactDOM.findDOMNode(this.refs.restaurantComment);
    const restaurantComment = restaurantCommentInput.value.trim();
    const restaurantScoreInput = ReactDOM.findDOMNode(this.refs.restauranScore);
    const restauranScore = restaurantScoreInput.value.trim();

    Meteor.call('tasks.insert', restauranName, restaurantLat, restaurantLng, restaurantType, restaurantComment, restauranScore);

    restauranNameInput.value = "";
    restaurantLatInput.value = "";
    restaurantLngInput.value = "";
    restaurantTypeInput.value = "";
    restaurantTypeInput.value = "";
    restaurantScoreInput.value = "";
  }
  _toggleHideCompleted() {
    const { hideCompleted } = this.state;
    this.setState({
      hideCompleted: !hideCompleted,
    })
  }

  renderTasks() {
    const { tasks } = this.props;
    const { hideCompleted } = this.state;
    let filteredTasks = tasks;

    if (hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map(task => {
      const { currentUser } = this.props;
      const currentUserId = currentUser && currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      )
    });
  }

  render() {
    const { incompleteCount, currentUser, tasks, qualifications } = this.props;

    return (

      <section>
        <header>
          <h1>Welcome to restaurants!({incompleteCount} restaurants)</h1>

          <AccountsUIWrapper />
          {currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit}>
              <input type="text"
                ref="restaurantName"
                placeholder="Add a new Restaurant name" />
              <input type="text"
                ref="restaurantLat"
                placeholder="Add a Restaurant lat" />
              <input type="text"
                ref="restaurantLng"
                placeholder="Add a Restaurant lng" />
              <input type="text"
                ref="restaurantType"
                placeholder="Add a Restaurant type" />
              <input type="text"
                ref="restaurantComment"
                placeholder="Write a restaurant Comment" />
              <input type="text"
                ref="restauranScore"
                placeholder="Score the restaurant" />
              <div className="col col-lg-3">
                <button className="btn btn-primary btn-sm" id="createForm" type="submit">Create</button>
              </div>
            </form> : null
          }
        </header>
        <ul>{this.renderTasks()}</ul>

        <Maps
          task={tasks}
        />
      </section>
    )
  }

}

export default withTracker(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);