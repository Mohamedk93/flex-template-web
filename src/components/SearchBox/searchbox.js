import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './SearchBox.css';

export class SearchBox extends Component {
    render () {
        const rootClassName = this.props.rootClassName
        const className = this.props.className
        const classes = classNames(rootClassName || css.root, className);
    return (
        
  <div className={css.topBorderWrapper}>

    <div className = {css.search-block-1}>
      <span className={css.title}>Search</span>
      <div className={css.area}>
        <span className={label}>Area</span>
        <select id="area-options">
          <option value="option-1">Option 1</option>
          <option value="option-2">Option 2</option>
          <option value="option-3">Option 3</option>
        </select>
      </div>
      
      <div className={css.date-time}>
        <div className={css.container-date-time}>
          <div className={css.container-date}>
            <span className={css.label}>Date</span>
            <input type="text" placeholder="dd-mm-yyyy"></input>
          </div>
          <div className={css.container-time}>
            <span className={css.label}>Time</span>
            <select name="" id="">
              <option value="option-1">12:00</option>
              <option value="option-2">12:30</option>
              <option value="option-3">14:00</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className={css.date-time.last}>
        <div className={css.container-date-time}>
          <div className={css.container-date}>
            <span className={css.label}>Date</span>
            <input type="text" placeholder="dd-mm-yyyy"></input>
          </div>
          <div className={css.container-time}>
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

SearchBoxComponent.defaultProps = {
    className: null,
    rootClassName: null,
  };
  
  SearchBoxComponent.propTypes = {
    className: string,
    rootClassName: string,
  };
    
  export default SearchBox;