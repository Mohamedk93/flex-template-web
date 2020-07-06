import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { string } from 'prop-types';
import css from './SearchBox.css';
import Dropdown from './SearchBox';
import { FormattedMessage, intlShape, injectIntl  } from '../../util/reactIntl';
import Button from '../Button/Button';
import { TopbarSearchForm } from '../../forms';
import config from '../../config';
import { createResourceLocatorString, pathByRouteName } from '../../util/routes';
import pickBy from 'lodash/pickBy';
import { parse, stringify } from '../../util/urlHelpers';
import routeConfiguration from '../../routeConfiguration';

const MAX_MOBILE_SCREEN_WIDTH = 768;

const redirectToURLWithModalState = (props, modalStateParam) => {
  const { history, location } = props;
  const { pathname, search, state } = location;
  const searchString = `?${stringify({ [modalStateParam]: 'open', ...parse(search) })}`;
  history.push(`${pathname}${searchString}`, state);
};

const redirectToURLWithoutModalState = (props, modalStateParam) => {
  const { history, location } = props;
  const { pathname, search, state } = location;
  const queryParams = pickBy(parse(search), (v, k) => {
    return k !== modalStateParam;
  });
  const stringified = stringify(queryParams);
  const searchString = stringified ? `?${stringified}` : '';
  history.push(`${pathname}${searchString}`, state);
};

const GenericError = props => {
  const { show } = props;
  const classes = classNames(css.genericError, {
    [css.genericErrorVisible]: show,
  });
  return (
    <div className={classes}>
      <div className={css.genericErrorContent}>
        <p className={css.genericErrorText}>
          <FormattedMessage id="Topbar.genericError" />
        </p>
      </div>
    </div>
  );
};

const { bool } = PropTypes;

GenericError.propTypes = {
  show: bool.isRequired,
};

export class SearchBox extends Component {

  constructor(props) {
    super(props);
    this.handleMobileSearchOpen = this.handleMobileSearchOpen.bind(this);
    this.handleMobileSearchClose = this.handleMobileSearchClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

    handleMobileSearchOpen() {
      redirectToURLWithModalState(this.props, 'mobilesearch');
    }

    handleMobileSearchClose() {
      redirectToURLWithoutModalState(this.props, 'mobilesearch');
    }

    handleSubmit(values) {
      const { currentSearchParams } = this.props;
      const { search, selectedPlace } = values.location;
      const { history } = this.props;
      const { origin, bounds } = selectedPlace;
      const originMaybe = config.sortSearchByDistance ? { origin } : {};
      const searchParams = {
        ...currentSearchParams,
        ...originMaybe,
        address: search,
        bounds,
      };
      history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, searchParams));
    }

    render () {
        const rootClassName = this.props.rootClassName
        const className = this.props.className
        const classes = classNames(rootClassName || css.root, className);
        const location = this.props
        const { mobilemenu, mobilesearch, address, origin, bounds } = parse(location.search, {
          latlng: ['origin'],
          latlngBounds: ['bounds'],
        });

        const locationFieldsPresent = config.sortSearchByDistance
          ? address && origin && bounds
          : address && bounds;
        const initialSearchFormValues = {
          location: locationFieldsPresent
            ? {
                search: address,
                selectedPlace: { address, origin, bounds },
              }
            : null,
        };
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
      <TopbarSearchForm
        onSubmit={this.handleSubmit}
        initialValues={initialSearchFormValues}
        isMobile
      />


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


const { func, number, shape } = PropTypes;

SearchBox.defaultProps = {
    className: null,
    rootClassName: null,
  };
SearchBox.propTypes = {
    className: string,
    rootClassName: string,
    history: shape({
      push: func.isRequired,
    }).isRequired,
    location: shape({
      search: string.isRequired,
    }).isRequired,

    // from withViewport
    viewport: shape({
      width: number.isRequired,
      height: number.isRequired,
    }).isRequired,

    // from injectIntl
    intl: intlShape.isRequired,

  };
  export default SearchBox;
