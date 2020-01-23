import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconLightning.css';

const IconLightning = props => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg className={css.root} version="1.1" viewBox="0 0 508.928 508.928" width="32" height="32">
      <polygon points="403.712,201.04 256.288,201.04 329.792,0 105.216,307.888 252.64,307.888 179.136,508.928" fill="#FFD83B" 
      />
    </svg>
  );
};

const { string } = PropTypes;

IconLightning.defaultProps = {
  className: null,
  rootClassName: null,
};

IconLightning.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconLightning;