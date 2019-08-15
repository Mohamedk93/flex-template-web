import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-helsinki',
    predictionPlace: {
      address: 'United States & Canada',
      bounds: new LatLngBounds(new LatLng(71.5388001, -66.885417), new LatLng(18.7763, 170.5957)),
    },
  },
  {
    id: 'default-oulu',
    predictionPlace: {
      address: 'Europe',
      bounds: new LatLngBounds(new LatLng(82.1673907, 74.3555001), new LatLng(34.5428, -31.4647999)),
    },
  },
  {
    id: 'default-ruka',
    predictionPlace: {
      address: 'Middle East & Africa',
      bounds: new LatLngBounds(new LatLng(42.3666999, 63.3333366), new LatLng(11.7975, 24.696775)),
    },
  },
];
