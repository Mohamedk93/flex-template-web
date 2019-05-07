import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-sf',
    predictionPlace: {
      address: 'All San Francisco',
      bounds: new LatLngBounds(new LatLng(37.9298239, -122.28178), new LatLng(37.6398299, -123.173825)),
    },
  },
  {
    id: 'default-fd',
    predictionPlace: {
      address: 'Financial District, SF',
      bounds: new LatLngBounds(new LatLng(37.798916, -122.3951365), new LatLng(37.7866303, -122.4070479)),
    },
];
