import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { string } from 'prop-types';
import css from './SearchBox.css';
import Dropdown from './SearchBox';
import { FormattedMessage } from '../../util/reactIntl';
import Button from '../Button/Button';
export class SearchBox extends Component {
    render () {
        const rootClassName = this.props.rootClassName
        const className = this.props.className
        const classes = classNames(rootClassName || css.root, className);
    return (
  <div className={css.topBorderWrapper}>
    <div className = {css.searchblock}>
      <p className={css.title}>Search Workspaces</p>
      <span className={css.subtitle}>Book coworking spaces and shared offices worldwide.</span>
           <p></p>

           <div className={css.hotdeskbutton}>
             <span className={css.buttonlabel}>Hotdesk</span>
           </div>

           <div className={css.meetingroombutton}>
             <span className={css.buttonlabel}>Meeting Room</span>
           </div>

           <div className={css.privateofficebutton}>
             <span className={css.buttonlabel}>Private Office</span>
           </div>

      <div className={css.area}>
        <span className={css.search}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 24 24" fill="transparent" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
        <span className={css.label}>Where do you want to work?</span>
      </div>

      <div className={css.bookingplan}>
      <span className={css.time}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 24 24" fill="transparent" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>
        <span className={css.label}>How long? (hourly, daily or monthly)</span>
      </div>

      <div className={css.startdate}>
      <span className={css.search}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
        <span className={css.label}>When would you like to work?</span>
      </div>

      <button className={css.heroButton}>
        <span className={css.heroText}>
          <FormattedMessage id="SectionHero.browseButton" />
        </span>
      </button>

    </div>
  </div>
    );
};
}
SearchBox.defaultProps = {
    className: null,
    rootClassName: null,
  };
SearchBox.propTypes = {
    className: string,
    rootClassName: string,
  };
  export default SearchBox;
