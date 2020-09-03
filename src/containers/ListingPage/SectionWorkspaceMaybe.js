import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionWorkspaceMaybe = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData.workspaces ? publicData.workspaces : [];
  return (
    <div className={css.sectionWorkspace}>
      <h2 className={css.workspaceTitle}>
        <FormattedMessage id="ListingPage.workspaceTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.workspaces"
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionWorkspaceMaybe;
