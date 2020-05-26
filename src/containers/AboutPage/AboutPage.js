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
} from '../../components';
import css from './AboutPage.css';
import image from './about-us-1056.jpg';
import {
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  ExternalLink,
} from '../../components';

const AboutPage = () => {
  const { siteFacebookPage, siteInstagramPage, siteTwitterHandle } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  const goToFb = intl.formatMessage({ id: 'Footer.goToFacebook' });
  const goToTwitter = intl.formatMessage({ id: 'Footer.goToTwitter' });
  const goToInsta = intl.formatMessage({ id: 'Footer.goToInstagram' });

  const fbLink = siteFacebookPage ? (
    <ExternalLink key="linkToFacebook" href={siteFacebookPage} className={css.icon} title={goToFb}>
      <IconSocialMediaFacebook />
    </ExternalLink>
  ) : null;

  const instragramLink = siteInstagramPage ? (
    <ExternalLink
      key="linkToInstagram"
      href={siteInstagramPage}
      className={css.icon}
      title={goToInsta}
    >
      <IconSocialMediaInstagram />
    </ExternalLink>
  ) : null;

  const twitterLink = siteTwitterPage ? (
    <ExternalLink
      key="linkToTwitter"
      href={siteTwitterPage}
      className={css.icon}
      title={goToTwitter}
    >
      <IconSocialMediaTwitter />
    </ExternalLink>
  ) : null;

  const { siteTwitterHandle, siteFacebookPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);
  
  return [fbLink, instragramLink, twitterLink, ].filter(v => v != null);
};
  

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

              <h3 className={css.subtitle}>Contact Us:</h3>

              <p>
                <strong>Customer service hotlines:</strong>

                <strong>Middle East:</strong>
                Egypt: +201006610069
                United Arab Emirates: +971544977193
                Lebanon: +9613255286

                <strong>Europe:</strong>
                United Kingdom: +447935660504
                Spain: +34634260940
                France: +33636056539

                <strong>Social Media:</strong>
                
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
