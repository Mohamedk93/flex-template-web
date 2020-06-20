import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionRentalsMaybe = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData.rentals ? publicData.rentals : [];
  return (
    <div className={css.sectionRentals}>
      <h2 className={css.rentalsTitle}>
        <FormattedMessage id="ListingPage.rentalsTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.rentals"
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionRentalsMaybe;
