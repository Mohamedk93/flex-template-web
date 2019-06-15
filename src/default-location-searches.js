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
  {
    id: 'default-6o',
    predictionPlace: {
      address: '6th October',
      bounds: new LatLngBounds(new LatLng(30.0909299, 31.0954284), new LatLng(29.792984, 30.6697083)),
    },
  },
  {
    id: 'default-ho',
    predictionPlace: {
      address: 'Heliopolis',
      bounds: new LatLngBounds(new LatLng(30.10649399999999, 31.3595412), new LatLng(30.0738844, 31.295667)),
    },
  },
];
