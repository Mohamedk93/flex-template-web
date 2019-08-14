import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionLocations.css';

import helsinkiImage from './images/americas.png';
import rovaniemiImage from './images/Europe.png';
import rukaImage from './images/MEA.png';

class LocationImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
const LazyImage = lazyLoadWithDimensions(LocationImage);

const locationLink = (name, image, searchQuery) => {
  const nameText = <span className={css.locationName}>{name}</span>;
  return (
    <NamedLink name="SearchPage" to={{ search: searchQuery }} className={css.location}>
      <div className={css.imageWrapper}>
        <div className={css.aspectWrapper}>
          <LazyImage src={image} alt={name} className={css.locationImage} />
        </div>
      </div>
      <div className={css.linkText}>
        <FormattedMessage
          id="SectionLocations.listingsInLocation"
          values={{ location: nameText }}
        />
      </div>
    </NamedLink>
  );
};

const SectionLocations = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionLocations.title" />
      </div>
      <div className={css.locations}>
        {locationLink(
          'United States & Canada',
          helsinkiImage,
          '?address=San%20Francisco%20Bay%20Area%2C%20CA%2C%20USA&bounds=38.8642448%2C-121.20817799999998%2C36.8941549%2C-123.632497'
        )}
        {locationLink(
          'Europe',
          rovaniemiImage,
          '?address=Financial%20District%2C%20San%20Francisco%2C%20CA%2C%20USA&bounds=37.798916%2C-122.39513650000004%2C37.7866303%2C-122.40704790000001'
        )}
        {locationLink(
          'Middle East & Africa',
          rukaImage,
          '?address=South%20San%20Francisco%2C%20CA%2C%20USA&bounds=37.6728499%2C-122.22053110000002%2C37.6324597%2C-122.47168399999998'
        )}
      </div>
    </div>
  );
};

SectionLocations.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionLocations.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionLocations;
