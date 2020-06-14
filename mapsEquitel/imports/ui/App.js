import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import {withTracker} from 'meteor/react-meteor-data';
import {Tasks} from '../api/tasks';
import Task from './Task';

class App extends Component {


  constructor(props){
    super(props);

    this.handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(event){
    event.preventDefault();

    const textInput = ReactDOM.findDOMNode(this.refs.textInput);

    const text = textInput.value.trim();

    Tasks.insert({
      text,
      createAt: new Date(),
    });

    textInput.value = '';
  }

  renderTasks(){
    const {tasks} = this.props;
    return tasks.map(task => <Task key = { task._id} task={task}/>);
  }

  render(){
    return(
      <div>
        <header>
          <h1>Welcome to restaurants!</h1>
          <form className="new-task" onSubmit={this.handleSubmit}>
            <input type= "text"
             ref="textInput" 
             placeholder="Escribe una nueva tarea"/>
          </form>
        </header>
        <ul>{this.renderTasks()}</ul>
      </div>
    )
  }

}

export default withTracker(()=>{
  return {
    tasks: Tasks.find({}, {sort: {createAt: -1}}).fetch(),
  };
})(App);