import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { string } from 'prop-types';
import css from './SearchBox.css';
import Dropdown from './SearchBox';
import { FormattedMessage, intlShape, injectIntl  } from '../../util/reactIntl';
import Button from '../Button/Button';
import { SearchForm } from '../../forms';
import config from '../../config';
import { locationBounds } from '../../util/googleMaps';
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

var selectedWorkspace = '';

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
    this.filterWorkspace = this.filterWorkspace.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
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

  
    filterWorkspace(workspacetype) {
        if(workspacetype == 'Hotdesk') {
          workspacetype = 'seats';
          }
        else if(workspacetype == 'Meeting Room') {
          workspacetype = 'Meeting Room';
        }
        else if(workspacetype == 'Office Room') {
          workspacetype = 'Office Room';
        }
        return `&pub_workspaces=${workspacetype}`;
    }
    handleClick (e){
      if(e.target.innerText == 'Search'){
        let options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(this.success, this.error, options)
      }
    }
  
    success(pos) {
      let crd = pos.coords;
      const latlng = {
        lat: crd.latitude,
        lng: crd.longitude
      }
      const coordindates = locationBounds(latlng, config.maps.search.currentLocationBoundsDistance)
      const path = this.generateSearch(coordindates)
      this.setState({path: path, canRedirect: true});
    }
  
    error(err) {
      const path = 's?address=Cairo%2C%20Cairo%20Governorate%2C%20Egypt&bounds=79.34942401%2C56.31453229%2C-57.56893982%2C-133.52921771'
      this.setState({path: path, canRedirect: true});
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };
  
    generateSearch(coordindates){
      if(Object.keys(coordindates).length !== 0){
        return `s?address=&bounds=${coordindates.ne.lat}%2C${coordindates.ne.lng}%2C${coordindates.sw.lat}%2C${coordindates.sw.lng}${this.filterWorkspace(selectedWorkspace)}`;
      };
    };

    workspaceType(workspace){
      selectedWorkspace= workspace;
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
    <div className = {css.searchblock}>
      <p className={css.title}>Search Workspaces</p>
      <span className={css.subtitle}>Book coworking spaces and shared offices worldwide.</span>
           <p></p>

           <div className={css.hotdeskbutton}>
             <span className={css.buttonlabel} onClick={this.workspaceType('Hotdesk')}>Hotdesk</span>
           </div>

           <div className={css.meetingroombutton}>
             <span className={css.buttonlabel}>Meeting Room</span>
           </div>

           <div className={css.privateofficebutton}>
             <span className={css.buttonlabel}>Private Office</span>
           </div>

      <div>

      <SearchForm
        onSubmit={this.handleSubmit}
        initialValues={initialSearchFormValues}
        isMobile
      />
      </div>

      <div className={css.bookingplan}>
      <span className={css.time}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 24 24" fill="transparent" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>
        <span className={css.label}>How long? (hourly, daily or monthly)</span>
      </div>

      <div className={css.startdate}>
      <span className={css.search}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
        <span className={css.label}>When would you like to work?</span>
      </div>

      <button className={css.heroButton}  onClick={((e) => this.handleClick(e))}>
        <span className={css.heroText}>
          <FormattedMessage id="SectionHero.browseButton" />
        </span>
      </button>

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
    onSubmit: func.isRequired,
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
 
  export default SearchBox ;
