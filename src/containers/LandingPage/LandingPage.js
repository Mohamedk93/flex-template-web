import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import config from '../../config';
import {
  Page,
  SectionHero,
  SectionHowItWorks,
  SectionLocations,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';
import { filterWorkspace, SearchBox } from '../../components';
import { TopbarContainer } from '../../containers';
import { locationBounds } from '../../util/googleMaps';
import facebookImage from '../../assets/HotdeskFacebook1200.jpg';
import twitterImage from '../../assets/HotdeskTwitter600.jpg';
import css from './LandingPage.css';

const mixpanel = require('mixpanel-browser');

export class LandingPageComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      canRedirect: false
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
  }
  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // We are using JSON-LD format
  handleClick (e){
    console.log("[Tanawy says] hello a click handle has been called",e);
    if(e.target.innerText == 'Search'){
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(this.success, this.error, options)
    }
  }

  componentDidUpdate(prevProps, prevState){
    const {path, canRedirect} = this.state;

    if(prevState.path !== path &&  path.length > 0 && canRedirect){
      this.props.history.push(this.state.path);
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
      mixpanel.track("search_button_landing_page", {
        coordinates_ne_lat: coordindates.ne.lat,
        coordinates_ne_lng: coordindates.ne.lng,
        coordinates_sw_lat: coordindates.sw.lat,
        coordinates_sw_lng: coordindates.sw.lng
      });
      return `s?address=&bounds=${coordindates.ne.lat}%2C${coordindates.ne.lng}%2C${coordindates.sw.lat}%2C${coordindates.sw.lng}`
    }
    mixpanel.track("search_button_landing_page");
  }

  render (){
    const { history, intl, location, scrollingDisabled } = this.props;
    const siteTitle = config.siteTitle;
    const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
    const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
    const schemaImage = `${config.canonicalRootURL}${facebookImage}`;
    const currentLoc = this.props.location;

    return (
      <Page
        className={css.root}
        scrollingDisabled={scrollingDisabled}
        contentType="website"
        description={schemaDescription}
        title={schemaTitle}
        facebookImages={[{ url: facebookImage, width: 1200, height: 470 }]}
        twitterImages={[
          { url: `${config.canonicalRootURL}${twitterImage}`, width: 600, height: 235 },
        ]}
        schema={{
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          description: schemaDescription,
          name: schemaTitle,
          image: [schemaImage],
        }}
      >
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            {/* <div className={css.heroContainer} onClick={((e) => this.handleClick(e))}> */}
            <div className={css.heroContainer} >

              <SectionHero className={css.hero} history={history} location={location} />
            </div>
            <ul className={css.sections}>
              <li className={css.section}>
                <div className={css.sectionContentFirstChild}>
                  <SectionLocations
                    location={currentLoc}
                  />
                </div>
              </li>
              <li className={css.section}>
                <div className={css.sectionContent}>
                  <SectionHowItWorks />
                </div>
              </li>
            </ul>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  };
}

const { bool, object } = PropTypes;

LandingPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

  // from withRouter
  history: object.isRequired,
  location: object.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
    scrollingDisabled: isScrollingDisabled(state),
  };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(
  withRouter,
  connect(mapStateToProps),
  injectIntl
)(LandingPageComponent);


export default LandingPage;
