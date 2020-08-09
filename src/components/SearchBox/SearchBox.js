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
    
    this.state = {
      deskType:'',
      timeScale:'', 
      address:'', 
      bounds:null,
      path: '',
      canRedirect: false};

    
    this.handleMobileSearchOpen = this.handleMobileSearchOpen.bind(this);
    this.handleMobileSearchClose = this.handleMobileSearchClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.filterWorkspace = this.filterWorkspace.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.setTimeScale = this.setTimeScale.bind(this);
    this.setDeskType = this.setDeskType.bind(this);
    this.filterRentalTypes = this.filterRentalTypes.bind(this);
    this.generateSearchWithAddress = this.generateSearchWithAddress.bind(this);
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
      console.log("Tanawy is here in handle submit searchbox js search params", searchParams);
      if(searchParams.address ==="" && searchParams.bounds !== this.state.bounds){
        console.log("tanawy is checking thebounds in searchbox", bounds);
        this.setState({bounds:searchParams.bounds});

      } else if(searchParams.address !== "" && searchParams.address !== this.state.address){
        this.setState({address: searchParams.address, bounds: searchParams.bounds});
      }
      // history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, searchParams));

    }

  
    filterWorkspace(workspacetype) {
      workspacetype = this.state.deskType;
      if(!workspacetype){
        return '';
      }
        if(workspacetype == 'Hotdesk') {
          workspacetype = 'seats';
          }
        else if(workspacetype == 'Meeting Room') {
          workspacetype = 'meeting_rooms';
        }
        else if(workspacetype == 'Office Room') {
          workspacetype = 'office_rooms';
        }
        return `&pub_workspaces=${workspacetype}`;
    }

    filterRentalTypes(){
      let rentalType = this.state.timeScale;
      if(!rentalType){
        return '';
      }
      if(rentalType == 'Hourly') {
        rentalType = 'hourly';
        }
      else if(rentalType == 'Daily') {
        rentalType = 'daily';
      }
      else if(rentalType == 'Monthly') {
        rentalType = 'monthly';
      }
      return `&pub_rentalTypes=${rentalType}`;
    }
    handleClick (e){
      if(e.target.innerText == 'Search'){
        let options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        let isAddressSelected = this.state.address !=="" || this.state.bounds;
        if(isAddressSelected){
          console.log("tanawy is debugging state from handleClick", this.state);
          if(this.state.bounds && this.state.address === ""){
            console.log("tanawy says searching location with bounds");
            let path = this.generateSearch(this.state.bounds);
            this.setState({path: path, canRedirect: true});

          } else {
            let path = this.generateSearchWithAddress(this.state.address,this.state.bounds);
            this.setState({path: path, canRedirect: true});

            // console.log("tanawy is debugging the path", path);


          }

        }else {

          navigator.geolocation.getCurrentPosition(this.success, this.error, options)
        }
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
      window.myGeneratedPath = path;
      this.setState({path: path, canRedirect: true});
    }
  
    error(err) {
      const path = 's?address=Cairo%2C%20Cairo%20Governorate%2C%20Egypt&bounds=79.34942401%2C56.31453229%2C-57.56893982%2C-133.52921771'
      this.setState({path: path, canRedirect: true});
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };
  
    generateSearch(coordindates){
     
        return `s?address=&bounds=${coordindates.ne.lat}%2C${coordindates.ne.lng}%2C${coordindates.sw.lat}%2C${coordindates.sw.lng}${this.filterRentalTypes()}${this.filterWorkspace(selectedWorkspace)}`;

    };

    generateSearchWithAddress(address, coordindates){
     let addressString = encodeURI(address);
     addressString = addressString.replace('&','%26');
      return `s?address=${addressString}&bounds=${(coordindates||{ne:{}}).ne.lat}%2C${(coordindates||{ne:{}}).ne.lng}%2C${(coordindates||{sw:{}}).sw.lat}%2C${(coordindates||{sw:{}}).sw.lng}${this.filterRentalTypes()}${this.filterWorkspace(selectedWorkspace)}`;

  };

    workspaceType(workspace){
      selectedWorkspace= workspace;
      
    }
  
    setDeskType(type){

      if(type !== this.state.deskType){

        this.setState({deskType: type});
      } else {
        this.setState({deskType: ''});
      }

    }
    setTimeScale(scale){
      if(scale !== this.state.timeScale){

        this.setState({timeScale: scale});
      } else {
        this.setState({timeScale: ''});
      }


    }

    createSearchQuery(){

    }

    createLocationQuery(){
      if(this.state.address === "" && !this.state.bounds){
        console.log("[Tanawy says location info are not used]");
        let options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(this.success, this.error, options);
      

      } else if(this.state.address !== ""){
        console.log("[Tanawy says location address info is used]",this.state.address);
      } else if(this.state.bounds){
        console.log("[Tanawy says location bounds info is used]", this.state.bounds);

      }
    }


  componentDidUpdate(prevProps, prevState){
    const {path, canRedirect} = this.state;

    if(prevState.path !== path &&  path.length > 0 && canRedirect){
      this.props.history.push(this.state.path);
    }
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

        const withHighlightIfSelected = (cssClass,label)=>{
          let isDeskLabel = label ==="HotDesk"||label ==="Meeting Room"|| label === "Office Room";
          if(isDeskLabel){
            if(this.state.deskType === label){
              return cssClass + ' ' + "selectedOption";
            }
            return cssClass;
          } else {
            if(this.state.timeScale === label)
            {
              return cssClass + ' ' + "selectedOption";
            }
            return cssClass;
          }
          
        }
    return (
    <div className = {css.searchblock}>
      <p className={css.title}>Search Workspaces</p>
      <span className={css.subtitle}>Book coworking spaces and shared offices worldwide.</span>
           <p></p>

           <div style={(this.state.deskType === "Hotdesk")?{"background-color":"#2ecc72"}:undefined} onClick={()=>this.setDeskType('Hotdesk')} className={(css.hotdeskbutton)}>
             <span className={css.buttonlabel} >Hotdesk</span>
           </div>

           <div style={(this.state.deskType === "Meeting Room")?{"background-color":"#2ecc72"}:undefined} onClick={()=>this.setDeskType('Meeting Room')} className={css.meetingroombutton}>
             <span className={css.buttonlabel}>Meeting Room</span>
           </div>

           <div style={(this.state.deskType === "Office Room")?{"background-color":"#2ecc72"}:undefined} onClick={()=>this.setDeskType('Office Room')} className={css.privateofficebutton}>
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
      <div>
      <div style={(this.state.timeScale === "Hourly")?{"background-color":"#2ecc72"}:undefined} onClick={()=>this.setTimeScale('Hourly')} className={css.hotdeskbutton}>
             <span className={css.buttonlabel} >Hourly</span>
           </div>

           <div style={(this.state.timeScale === "Daily")?{"background-color":"#2ecc72"}:undefined} onClick={()=>this.setTimeScale('Daily')} className={css.meetingroombutton}>
             <span className={css.buttonlabel}>Daily</span>
           </div>

           <div style={(this.state.timeScale === "Monthly")?{"background-color":"#2ecc72"}:undefined} onClick={()=>this.setTimeScale('Monthly')} className={css.privateofficebutton}>
             <span className={css.buttonlabel}>Monthly</span>
           </div>
      </div>

      {/* <div className={css.startdate}>
      <span className={css.search}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
        <span className={css.label}>When would you like to work?</span>
      </div> */}

      <button className={css.heroButton}  onClick={(e) => this.handleClick(e)}>
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
