import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks';
import Task from './Task';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import settings from '../../settings';

const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.ex&key=${settings.maps.google_maps_key}`;

class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    }

    this.handleSubmit = this._handleSubmit.bind(this);
    this.toggleHideCompleted = this._toggleHideCompleted(this);
  }

  _handleSubmit(event) {
    event.preventDefault();

    const textInput = ReactDOM.findDOMNode(this.refs.textInput);

    const text = textInput.value.trim();

    Meteor.call('tasks.insert', text);

    textInput.value = '';
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
          showPrivateButton={showPrivateButton
          } />
      )
    });
  }

  render() {
    const { incompleteCount, currentUser } = this.props;
    const { hideCompleted } = this.state;

    return (

      <div>
        <header>
          <h1>Welcome to restaurants!({incompleteCount} restaurants)</h1>

          {/* <label className='hide-completed'>
            <input
              type="checkbox"
              readOnly
              checked={hideCompleted}
              onClick={this.toggleHideCompleted}
            />
            add a new restaurant
          </label> */}

          <AccountsUIWrapper />
          {currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit}>
              <input type="text"
                ref="textInput"
                placeholder="Add a new Restaurant" />
            </form> : null
          }
        </header>
        <ul>{this.renderTasks()}</ul>

        {/* <Maps
          googleMapURL= {mapURL}
          containerElement= {<div style= {{height: '400px'}}/>}
          mapElement= {<div style={{height: '100%'}}/>}
          loadingElement= {<p>cargando...</p>}
        /> */}
        <Map google={this.props.google}
          className="custom-map"
          center={{
            lat: 4.6328987,
            lng: -74.1016272
          }}
          initialCenter={{
            lat: 4.6328987,
            lng: -74.1016272
          }}
          zoom={11}>
          {/* {this.state.mapArray.map(marker => {
            if (this.state.search !== "Todas") {
              if (this.state.search === marker.city) {
                return <Marker
                  key={Math.random()}
                  icon={marker.image_icon}
                  address={marker.address}
                  onClick={this.onMarkerClick}
                  position={{
                    lat: marker.latitude,
                    lng: marker.longitude
                  }}
                  name={marker.name}
                />
              }
            } else {
              return <Marker
                key={Math.random()}
                icon={marker.image_icon}
                address={marker.address}
                onClick={this.onMarkerClick}
                position={{
                  lat: marker.latitude,
                  lng: marker.longitude
                }}
                name={marker.name}
              />
            }

          })} */}

          {/* <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
            <div>
              <h3>{this.state.selectedPlace.name}</h3>
            </div>
            <div>
              <p>Dirección: {this.state.selectedPlace.address}</p>
            </div>
          </InfoWindow> */}

        </Map>
      </div>
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
})
(GoogleApiWrapper({
  apiKey: (settings.maps.google_maps_key)
})(App));