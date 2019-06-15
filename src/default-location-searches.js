import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-nc',
    predictionPlace: {
      address: 'New Cairo',
      bounds: new LatLngBounds(new LatLng(30.1022173, 31.6126441), new LatLng(29.933515, 31.362276)),
    },
  },
  {
    id: 'default-ma',
    predictionPlace: {
      address: 'Maadi',
      bounds: new LatLngBounds(new LatLng(29.9726801, 31.3495562), new LatLng(29.945829, 31.240139)),
    },
  },
];
