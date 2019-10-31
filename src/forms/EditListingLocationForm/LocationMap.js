import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import css from './LocationMap.css';
import config from '../../config';

class LocationMap extends Component {
  constructor(props){
    super(props);
    // this.state = {
    //   zoomLevel: 10,
    // };
    // this.handleZoomChanged = this.handleZoomChanged.bind(this);
  }

  // handleZoomChanged(e) {
  //   // const zoomLevel = e.getZoom();
  //   console.log("zoomLevel", e);
  //   // if (zoomLevel !== this.state.zoomLevel) {
  //   //   this.setState({zoomLevel});
  //   // }
  // }

  render() {

    const { coords, onMarkerDragEnd } = this.props;

    const lat = coords.lat;
    const lng = coords.lng;

    const MapField = withGoogleMap(props => (
      <GoogleMap
        // defaultZoom={this.state.zoomLevel}
        defaultZoom={10}
        // onZoomChanged={e => this.handleZoomChanged(e)}
        defaultCenter={{ lat, lng }}
      >
        <Marker
          position={{ lat, lng }}
          draggable={true}
          onDragEnd={coords => onMarkerDragEnd(coords)}
        />
      </GoogleMap>
    ));

    return (
      <div className={css.mapWrapper}>
        <MapField 
          containerElement={ <div style={{ height: `500px`, width: '100%' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
        />
      </div>
    )
  }
}

export default LocationMap;