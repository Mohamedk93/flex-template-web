import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import css from './LocationMap.css';
import config from '../../config';

class LocationMap extends Component {
  constructor(props){
    super(props);

    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.getLocationCoords = this.getLocationCoords.bind(this);
    this.getLocationPoint = this.getLocationPoint.bind(this);

    this.state = {
      point: null,
      coords: { lat: 0, lng: 0 },
    }
  }

  getLocationCoords(point) {

  }

  getLocationPoint(coords) {
    if(coords) {
      const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&language=en&result_type=locality&result_type=country&key=${config.maps.googleMapsAPIKey}`
      fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
          const address = data &&
            data.results &&
            data.results[0] &&
            data.results[0].formatted_address ?
            data.results[0].formatted_address : null;
          this.setState({
            point: address,
          })
        })
        .catch(error => {console.log(error)});
    };
  }

  onMarkerDragEnd(coords) {
    const { latLng } = coords;
    const lat = latLng ? latLng.lat() : null;
    const lng = latLng ? latLng.lng() : null;
    lat && lng && this.setState({ 
      coords: { lat, lng }
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    return true
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.coords !== this.state.coords) {
      this.getLocationPoint(this.state.coords)
    }
  }

  render() {

    const lat = this.state.coords.lat;
    const lng = this.state.coords.lng;

    const MapField = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat, lng }}
      >
        <Marker
          position={{ lat, lng }}
          draggable={true}
          onDragEnd={coords => this.onMarkerDragEnd(coords)}
        />
      </GoogleMap>
    ));

    return (
      <div className={css.mapWrapper}>
        <MapField 
          containerElement={ <div style={{ height: `500px`, width: '500px' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
        />
      </div>
    )
  }
}

export default LocationMap;