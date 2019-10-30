import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

export const LocationMap = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    <Marker
      position={{ lat: -34.397, lng: 150.644 }}
      // onClick={props.onMarkerClick}
      draggable={true}
      // onDragend={this.onMarkerDragEnd}
    />
  </GoogleMap>
))