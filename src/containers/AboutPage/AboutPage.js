import React from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './AboutPage.css';
import image from './about-us-1056.jpg';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
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
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Enabling people to access work spaces. Enabling hosts to make money.</h1>
          <img className={css.coverImage} src={image} alt="My first ice cream." />

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <p>Freelancer growth is booming, and they need easy and affordable places to work - Mohamed K, CEO & Founder</p>
            </div>

            <div className={css.contentMain}>
              <h2>
                Booming start-ups, increase in free lancers, there are many reasons that are causing the workforce to decentralize. These people need access to flexible work spaces.
              </h2>

              <p>
                Hotdesk is a marketplace platform for those who want spaces to work, and those with additional spaces that would like to make more income.
                Hosts can upload their work spaces in a few clicks, and they can be accessed instantly by customers looking for a place to work.
              </p>

              <h3 className={css.subtitle}>Do you have extra work spaces??</h3>

              <p>
                Hotdesk offers you a good way to earn some extra cash! If you're not fully
                using your work space, why not rent it to other people while it's free. And even if
                you are using your work space every morning, why don't you rent it out in the afternoon?
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
