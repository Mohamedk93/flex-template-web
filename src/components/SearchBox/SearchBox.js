import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { string } from 'prop-types';
import css from './SearchBox.css';
import Dropdown from './SearchBox';
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
             <span className={css.buttonlabel}>Hotdesk</span>
           </div>

           <div className={css.privateofficebutton}>
             <span className={css.buttonlabel}>Hotdesk</span>
           </div>

      <div className={css.area}>
        <span className={css.label}>Where do you want to work?</span>
      </div>
      <p></p>

      <div className={css.bookingplan}>
        <span className={css.label}>How long? (hourly, daily or monthly)</span>
      </div>

      <div className={css.startdate}>
        <span className={css.label}>When would you like to work?</span>
      </div>

      <button className={css.btn.primary}>Search</button>
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
