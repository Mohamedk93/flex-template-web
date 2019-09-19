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
              <p>"We envision being the App that enables people to access workspaces globally, and to be the ones who bring out extra unused workspaces to the market." The Co-Founders: Mohamed K. & Ali Shweki</p>
            </div>

            <div className={css.contentMain}>
              <h2>
                Booming start-ups, increase in the number of free lancers, flexible corporates - there are many reasons that are causing the workforce to change and decentralize. These people need access to flexible work spaces on demand in the easiest form possible..
              </h2>

              <p>
                Hotdesk is an Online Platform that connects Coworking Spaces and Office Owners to people that are looking for a place to work.
                Hosts can upload their work spaces in a few clicks, and they can be accessed instantly by customers.
              </p>

              <h3 className={css.subtitle}>Do you have extra work spaces?</h3>

              <p>
                Hotdesk offers you a good way to earn some extra cash! If you're not fully
                using your work space, why not rent it to other people while it's free? Even if
                you are using your workspace every morning, why don't you rent it out in the afternoon?
                You can also checkout our{' '}
                <ExternalLink href={siteFacebookPage}>Facebook</ExternalLink> and{' '}
                <ExternalLink href={siteTwitterPage}>Twitter</ExternalLink>.
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
