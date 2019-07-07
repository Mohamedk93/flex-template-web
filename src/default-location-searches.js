import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-bayarea',
    predictionPlace: {
      address: 'Bay Area',
      bounds: new LatLngBounds(new LatLng(38.8642448, -121.20817799999998), new LatLng(36.8941549, -123.632497)),
    },
  },
  {
    id: 'default-financialdistrict',
    predictionPlace: {
      address: 'Financial District',
      bounds: new LatLngBounds(new LatLng(37.798916, -122.39513650000004), new LatLng(37.7866303, -122.40704790000001)),
    },
  },
  {
    id: 'default-southsf',
    predictionPlace: {
      address: 'South SF',
      bounds: new LatLngBounds(new LatLng(37.6728499, -122.22053110000002), new LatLng(37.6324597, -122.47168399999998)),
    },
  },
  {
    id: 'default-allsf',
    predictionPlace: {
      address: 'All San Francisco',
      bounds: new LatLngBounds(new LatLng(37.812, -122.34820000000002), new LatLng(37.70339999999999, -122.52699999999999)),
    },
  },
];
