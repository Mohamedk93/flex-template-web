import React from 'react';
import config from '../../config';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  HistoryBackButton,
  Footer,
} from '../../components';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import css from './AboutPage.css';
import image from './about-us-1056.jpg';

const AboutPage = () => {

  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About Hotdesk',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer 
          className={css.topbar}
          mobileRootClassName={css.mobileTopbar}
          desktopClassName={css.desktopTopbar}
          mobileClassName={css.mobileTopbar}
          />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Enabling people to access work spaces. Enabling hosts to make money.</h1>
          <img className={css.coverImage} src={image} alt="My first ice cream." />

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <p>"We envision being the App that enables people to access workspaces globally, and to be the ones who bring out extra unused workspaces to the market." The Co-Founders: Mohamed K, Ali Shweki and Mohamed ElSarrag.</p>
            </div>

            <div className={css.contentMain}>
              <h2>
                Booming start-ups, increase in the number of free lancers, flexible corporates - there are many reasons that are causing the workforce to change and decentralize. These people need access to flexible work spaces on demand in the easiest form possible..
              </h2>

              <p>
                Hotdesk is an Online Platform that connects Coworking Spaces and Office Owners to people that are looking for a place to work.
                Hosts can upload their work spaces in a few clicks, and they can be accessed instantly by customers.
              </p>

              <h3 className={css.subtitle}>Contact Info:</h3>
              <p>
              <strong>Head Office:</strong> Hotdesk Technologies Middle East HQ Limited<br/>
              <strong>Registered Address:</strong> Office-8 , Office-9, Level 4, Gate District Precinct Building 05, Dubai International Financial Centre (DIFC), PO Box 507211, Dubai, United Arab Emirates.<br/>
              <br/>
              <strong>US Office:</strong> Hotdesk Technologies Middle East HQ Limited<br/>
              <strong>Registered Address:</strong> 2035 Sunset Lake Road, Suite B-2, Newark, Zip Code 19702, New Castle, Delaware, USA.<br/>
              <br/>
              <strong>Customer service hotlines:</strong><br/>
              <br/>
              <strong>Middle East:</strong><br/>
              Egypt: +201006610069<br/>
              United Arab Emirates: +971544977193<br/>
              Lebanon: +9613255286<br/>
              <br/>
              <strong>Europe:</strong><br/>
              United Kingdom: +447935660504<br/>
              Spain: +34634260940<br/>
              France: +33636056539<br/>
              <br/>
              <strong>Email:</strong> admin@hotdesk-app.com<br/>
              </p>

            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>

    </StaticPage>

  );
};

export default AboutPage;
