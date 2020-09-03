import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionLocations.css';

import helsinkiImage from './images/americas.jpg';
import rovaniemiImage from './images/Europe.jpg';
import rukaImage from './images/MEA.jpg';

class LocationImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
const LazyImage = lazyLoadWithDimensions(LocationImage);

const mixpanel = require('mixpanel-browser');


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
  const { rootClassName, className, rootLocationClassName } = props;

  const classes = classNames(rootClassName || css.root, className);
  const title = props.location.pathname === '/' ? <FormattedMessage id="SectionLocations.title" /> : <FormattedMessage id="SearchPage.listingsAround" />;
  const classesLocations = classNames(rootLocationClassName, css.locations || css.locations);

  return (
    <div className={classes}>
      <div className={css.title}>
        {title}
      </div>
      <div className={classesLocations}>
        {locationLink(
          'United States & Canada',
          helsinkiImage,
          '?address=United%20States&bounds=49.38%2C-66.94%2C25.82%2C-124.38999999999999'
        )}
        {locationLink(
          'Europe',
          rovaniemiImage,
          '?address=Europe&bounds=65%2C55%2C34%2C-11'
        )}
        {locationLink(
          'Middle East & Africa',
          rukaImage,
          '?address=Middle%20East&bounds=37.60801936%2C58.73156797%2C-10.97046286%2C11.27063047'
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
