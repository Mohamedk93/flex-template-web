import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import SearchMapWithGoogleMap, {
  getMapCenter,
} from '../../components/SearchMap/SearchMapWithGoogleMap';
import css from './LocationMap.css';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';
const { LatLng } = sdkTypes;

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
        ref={(map) => this._map = map}
        onDragEnd={(e) => {
          let center = getMapCenter(this._map)
          let latLng = new LatLng(center.lat, center.lng);
          onMarkerDragEnd({latLng});
        }}
        // onZoomChanged={() => console.log("ded dwed")}
      >
      </GoogleMap>
    ));

    return (
      <div className={css.mapWrapperOuter}>
        <div className={css.mapMarker}>
        </div>
        <div className={css.mapWrapper}>
          <MapField 
            containerElement={ <div style={{ height: `500px`, width: '100%' }} /> }
            mapElement={ <div style={{ height: `100%` }} /> }
          />
        </div>
      </div>
    )
  }
}

export default LocationMap;