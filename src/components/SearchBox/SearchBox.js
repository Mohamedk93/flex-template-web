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
      <span className={css.title}>Search</span>
      <div className={css.area}>
        <span className={css.label}>How long? (hourly, daily or monthly)</span>
        <select id="area-options">
          <option value="option-1">Hourly</option>
          <option value="option-2">Daily</option>
          <option value="option-3">Monthly</option>
        </select>
      </div>
      <div className={css.datetime}>
        <div className={css.containerdatetime}>
          <div className={css.containerdate}>
            <span className={css.label}>Date</span>
            <input type="text" placeholder="dd-mm-yyyy"></input>
          </div>
          <div className={css.containertime}>
            <span className={css.label}>Time</span>
            <select name="" id="">
              <option value="option-1">12:00</option>
              <option value="option-2">12:30</option>
              <option value="option-3">14:00</option>
            </select>
          </div>
        </div>
      </div>
      <div className={css.datetime.last}>
        <div className={css.containerdatetime}>
          <div className={css.containerdate}>
            <span className={css.label}>Date</span>
            <input type="text" placeholder="dd-mm-yyyy"></input>
          </div>
          <div className={css.containertime}>
            <span className={css.label}>Time</span>
            <select name="" id="">
              <option value="option-1">12:00</option>
              <option value="option-2">12:30</option>
              <option value="option-3">14:00</option>
            </select>
          </div>
        </div>
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
