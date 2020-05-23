import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SectionHero.css'; 
import Button from '../Button/Button';
import {SearchBox} from '../../components';

export class SectionHero extends Component {
  render (){
    const rootClassName = this.props.rootClassName
    const className = this.props.className
    const classes = classNames(rootClassName || css.root, className);
    return (
      <div className={classes}>
        <div className={css.heroContent}>
          <h1 className={css.heroMainTitle}>
            <FormattedMessage id="SectionHero.title" />
          </h1>
     <span className={css.topBorderWrapper}>
            <SearchBox />
          </span>
          <h2 className={css.heroSubTitle}>
            <FormattedMessage id="SectionHero.subTitle" />
          </h2>
          <Button className={css.heroButton}>
            <span className={css.heroText}>
              <FormattedMessage id="SectionHero.browseButton" />
            </span>
          </Button>
        </div>
      </div>
    );
  };
  }
  
SectionHero.defaultProps = { rootClassName: null, className: null,  };

SectionHero.propTypes = {
  rootClassName: string,
  className: string
};

export default SectionHero;