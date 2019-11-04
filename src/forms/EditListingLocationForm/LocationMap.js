import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import css from './LocationMap.css';
import config from '../../config';

class LocationMap extends Component {
  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.updateMap !== this.props.updateMap) {
      return true
    } else {
      return false
    }
  }

  render() {

    const { coords, onMarkerDragEnd, updateMap } = this.props;

    const lat = coords.lat;
    const lng = coords.lng;

    const MapField = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat, lng }}
        options={{gestureHandling: "greedy"}}
        onDragEnd={(e) => console.log("dwed", e)}
        onZoomChanged={() => console.log("ded dwed")}
      >
        <Marker
          position={{ lat, lng }}
          draggable={true}
          onDragEnd={coordsObj => onMarkerDragEnd(coordsObj)}
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