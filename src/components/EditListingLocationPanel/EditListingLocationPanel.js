import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';
import { EditListingLocationForm } from '../../forms';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';

import css from './EditListingLocationPanel.css';

const { LatLng } = sdkTypes;

class EditListingLocationPanel extends Component {
  constructor(props) {
    super(props);  
    
    this.state = {
      initialValues: this.getInitialValues(),

      city: this.getInitialCustomValues('city'),
      country: this.getInitialCustomValues('country'),
      coords: this.getInitialCoords(),
      
      point: null, 
    };

    this.getInitialCoords = this.getInitialCoords.bind(this);
    this.getInitialValues = this.getInitialValues.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.getLocationPoint = this.getLocationPoint.bind(this);
    this.setNewInitialValues = this.setNewInitialValues.bind(this);
    this.getInitialCustomValues = this.getInitialCustomValues.bind(this);
  }

  getInitialValues() {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { geolocation, publicData } = currentListing.attributes;

    // Only render current search if full place object is available in the URL params
    // TODO bounds are missing - those need to be queried directly from Google Places
    const locationFieldsPresent =
      publicData && publicData.location && publicData.location.address && geolocation;
    const location = publicData && publicData.location ? publicData.location : {};
    const { address, building } = location;

    return {
      building,
      location: locationFieldsPresent
        ? {
            search: address,
            selectedPlace: { address, origin: geolocation },
          }
        : null,
    };
  }

  getInitialCustomValues(param) {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { publicData } = currentListing.attributes;
    const value = publicData ? publicData[param] : null;
    return value
  }

  setNewInitialValues(coords, formattedAddress) {

    const building = this.state.initialValues.building;
    const coordsObj = new LatLng(coords.lat, coords.lng);

    const initialValues = {
      building,
      location: {
        search: formattedAddress,
        selectedPlace: { 
          address: formattedAddress, 
          origin: coordsObj,
        },
      },
    }

    this.setState({
      initialValues
    })

  }

  getInitialCoords() {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { geolocation } = currentListing.attributes;
    return {
      lat: geolocation.lat,
      lng: geolocation.lng,
    }
  }

  getLocationPoint(coords, update = false) { 
    const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&language=en&result_type=locality&result_type=country&key=${config.maps.googleMapsAPIKey}`
    fetch(requestUrl)
      .then(response => response.json())
      .then(data => {

        const formattedAddress = data &&
          data.results &&
          data.results[0] &&
          data.results[0].formatted_address ?
          data.results[0].formatted_address : null;

        const address = data &&
          data.results &&
          data.results[0] &&
          data.results[0].address_components ?
          data.results[0].address_components : null;

        const city = address ? address.filter(function(item){
          return item.types.indexOf("locality") !== -1
        }) : null;
        const cityString = city ? city[0].long_name : null;

        const country = address ? address.filter(function(item){
          return item.types.indexOf("country") !== -1
        }) : null;
        const countryString = country ? country[0].long_name : null;

        this.setState({ 
          city: cityString,
          country: countryString,
          point: formattedAddress,
          coords,
        });

        if(update) {
          this.setNewInitialValues(coords, formattedAddress);
        }

      })
      .catch(error => {console.log(error)});
  }

  onMarkerDragEnd(coordsObj) {
    const { latLng } = coordsObj;
    const coords = { 
      lat: latLng.lat(), 
      lng: latLng.lng(),
    };
    const update = true;
    this.getLocationPoint(coords, update);
  }

  render() {
    const {
      className,
      rootClassName,
      listing,
      onSubmit,
      onChange,
      submitButtonText,
      panelUpdated,
      updateInProgress,
      errors,
    } = this.props;

    console.log("state!", this.state);

    const classes = classNames(rootClassName || css.root, className);
    const currentListing = ensureOwnListing(listing);

    const isPublished =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
    const panelTitle = isPublished ? (
      <FormattedMessage
        id="EditListingLocationPanel.title"
        values={{ listingTitle: <ListingLink listing={listing} /> }}
      />
    ) : (
      <FormattedMessage id="EditListingLocationPanel.createListingTitle" />
    );

    return (
      <div className={classes}>
        <h1 className={css.title}>{panelTitle}</h1>
        <EditListingLocationForm
          className={css.form}
          initialValues={this.state.initialValues}
          onSubmit={values => {
            const { building = '', location } = values;
            const {
              selectedPlace: { address, origin },
            } = location;
            const updateValues = {
              geolocation: origin,
              publicData: {
                location: { 
                  address, 
                  building,
                },
                city: this.state.city,
                country: this.state.country,
              },
            };
            this.setState({
              initialValues: {
                building,
                location: { search: address, selectedPlace: { address, origin } },
              },
            });
            onSubmit(updateValues);
          }}
          onChange={onChange}
          saveActionMsg={submitButtonText}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
          getLocationPoint={this.getLocationPoint}
          coords={this.state.coords}
          city={this.state.city}
          getLocationPoint={this.getLocationPoint}
          onMarkerDragEnd={this.onMarkerDragEnd}
        />
      </div>
    );
  }
}

const { func, object, string, bool } = PropTypes;

EditListingLocationPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingLocationPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingLocationPanel;
