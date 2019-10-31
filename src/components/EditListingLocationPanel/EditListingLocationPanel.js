import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';
import { EditListingLocationForm } from '../../forms';
import config from '../../config';

import css from './EditListingLocationPanel.css';

class EditListingLocationPanel extends Component {
  constructor(props) {
    super(props);
    
    const publicData = this.props.listing &&
    this.props.listing.attributes &&
    this.props.listing.attributes.publicData ?
    this.props.listing.attributes.publicData : null;
    
    this.state = {
      initialValues: this.getInitialValues(),
      city: publicData ? publicData.city : null,
      country: publicData ? publicData.country : null,
      
      point: null,
      coords: this.getInitialCoords(),
    };

    this.getInitialCoords = this.getInitialCoords.bind(this);
    this.getInitialValues = this.getInitialValues.bind(this);
    this.setAdditionalGeodata = this.setAdditionalGeodata.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.getLocationCoords = this.getLocationCoords.bind(this);
    this.getLocationPoint = this.getLocationPoint.bind(this);
    this.getUpdatedValues = this.getUpdatedValues.bind(this);
  }

  setAdditionalGeodata(params) {
    const { city, country } = params;
    this.setState({
      city,
      country,
    })
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

  getUpdatedValues(address) {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { geolocation, publicData } = currentListing.attributes;

    // Only render current search if full place object is available in the URL params
    // TODO bounds are missing - those need to be queried directly from Google Places
    const locationFieldsPresent =
      publicData && publicData.location && publicData.location.address && geolocation;
    const location = publicData && publicData.location ? publicData.location : {};
    const { building } = location;

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

  getInitialCoords() {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { geolocation } = currentListing.attributes;
    return {
      lat: geolocation.lat,
      lng: geolocation.lng,
    }
  }

  getLocationCoords(point) {

  }

  getLocationPoint(coords) { 
    if(coords) {
      const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&language=en&result_type=locality&result_type=country&key=${config.maps.googleMapsAPIKey}`
      const isUpdate = true;
      fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
          const formattedAddress = data &&
            data.results &&
            data.results[0] &&
            data.results[0].formatted_address ?
            data.results[0].formatted_address : null;

          // Or use city name
          const address = data &&
            data.results &&
            data.results[0] &&
            data.results[0].address_components ?
            data.results[0].address_components : null;

          const city = address ? address.filter(function(item){
            return item.types.indexOf("locality") !== -1
          }) : null;
          const cityName = city ? city[0].long_name : null;

          this.setState({
            // initialValues: this.getUpdatedValues(cityName),
            initialValues: this.getUpdatedValues(formattedAddress),
          })
        })
        .catch(error => {console.log(error)});
    };
  }

  onMarkerDragEnd(coords) {
    const { latLng } = coords;
    const lat = latLng ? latLng.lat() : null;
    const lng = latLng ? latLng.lng() : null;
    lat && lng && this.setState({ 
      coords: { lat, lng }
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    return true
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.coords !== this.state.coords) {
      this.getLocationPoint(this.state.coords)
    }
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
          setAdditionalGeodata={this.setAdditionalGeodata}
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
