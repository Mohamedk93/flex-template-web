import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing } from '../../util/data';
import config from '../../config';

import css from './SearchMapPriceLabel.css';

class SearchMapPriceLabel extends Component {
  shouldComponentUpdate(nextProps) {
    const currentListing = ensureListing(this.props.listing);
    const nextListing = ensureListing(nextProps.listing);
    const isSameListing = currentListing.id.uuid === nextListing.id.uuid;
    const hasSamePrice = currentListing.attributes.price === nextListing.attributes.price;
    const hasSameActiveStatus = this.props.isActive === nextProps.isActive;
    const hasSameRefreshToken =
      this.props.mapComponentRefreshToken === nextProps.mapComponentRefreshToken;

    return !(isSameListing && hasSamePrice && hasSameActiveStatus && hasSameRefreshToken);
  }

  render() {
    const { className, rootClassName, intl, listing, onListingClicked, isActive, currentUser } = this.props;
    const currentListing = ensureListing(listing);
    const { price } = currentListing.attributes;

    // Create formatted price if currency is known or alternatively show just the unknown currency.
    let formattedPrice =
      price && price.currency === config.currency ? formatMoney(intl, price) : price.currency;

    let currency = null;
    let rates = [];
    let result = null;
    if(currentUser && currentUser.attributes.profile.protectedData.currency){
      currency = currentUser.attributes.profile.protectedData.currency;
      rates = currentUser.attributes.profile.protectedData.rates;
      result = rates.find(e => e.iso_code == currency);
    }else if(typeof window !== 'undefined'){
      rates = JSON.parse(localStorage.getItem('rates'));
      currency = localStorage.getItem('currentCode');
      result = !rates ? null : rates.find(e => e.iso_code == currency);
    }
    if(result){
      formattedPrice = formattedPrice.substr(1)
      formattedPrice = formattedPrice * result.current_rate
      formattedPrice = formattedPrice.toFixed(2);
      formattedPrice = result.symbol.toString() + formattedPrice;
    }
    const classes = classNames(rootClassName || css.root, className);
    const priceLabelClasses = classNames(css.priceLabel, { [css.priceLabelActive]: isActive });
    const caretClasses = classNames(css.caret, { [css.caretActive]: isActive });

    return (
      <button className={classes} onClick={() => onListingClicked(currentListing)}>
        <div className={css.caretShadow} />
        <div className={priceLabelClasses}>{formattedPrice}</div>
        <div className={caretClasses} />
      </button>
    );
  }
}

SearchMapPriceLabel.defaultProps = {
  className: null,
  rootClassName: null,
};

const { func, string } = PropTypes;

SearchMapPriceLabel.propTypes = {
  className: string,
  rootClassName: string,
  listing: propTypes.listing.isRequired,
  onListingClicked: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(SearchMapPriceLabel);
