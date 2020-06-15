import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import settings from '../../settings';
import ModalInfoMarker from "./ModalInfoMarker";

class Maps extends Component {


  constructor(props) {
    super(props);

    this.state = {
      open_TC: false,
      nameRestaurant:""
    }
  }

 
  onInfoWiweClick = (props, marker, e) => {
    console.log('THE EVENT IS THROW', props, marker, e);
    this.setState({
      open_TC: true,
      nameRestaurant: marker.name
    })
  }

  handleClose_TC = () => {
    this.setState({open_TC: false});
  };

  render() {
    const {  task } = this.props;

    return (

      <section>

        <ModalInfoMarker
          name={this.state.nameRestaurant}
          open_TC={this.state.open_TC}
          TC_messaje={this.state.TC_messaje}
          handleClose_TC={this.handleClose_TC}
        />
        <Map
          google={this.props.google}
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
          {task.map(marker => {
            return <Marker
              key={Math.random()}
              icon={marker.icon}
              onClick={this.onInfoWiweClick}
              position={{
                lat: marker.restaurantLat,
                lng: marker.restaurantLng
              }}
              name={marker.restauranName}
            />
          })}

        </Map>
      </section>
    )
  }

}

export default (GoogleApiWrapper({
    apiKey: (settings.maps.google_maps_key)
  })(Maps));