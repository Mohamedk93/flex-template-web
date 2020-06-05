import React from 'react';
import './FrequentlyAskedQuestions.css';
import Dropdown from './Dropdown';
import { StaticPage, TopbarContainer } from '..';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';



function FrequentlyAskedQuestions() {
  return (
    <StaticPage
    title="FAQs"
    schema={{
      '@context': 'https://schema.org',
      '@type': 'FAQs',
      description: 'Frequently asked questions',
      name: 'Frequently asked questions',
    }}
  >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>

    <div className={css.container}>
      <h1 className={css.pageTitle}>Frequently asked questions</h1>
      <Dropdown title="What is Hotdesk?" items="Studiotime is the largest and most trusted online community to book music studios. We have music studios in 35+ countries on our site. We’re a bootstrap marketplace and have successfully generated thousands of bookings in the past two years since we first started. 

Our mission is to help artists further their careers by making home studios to top-line studios all around the world accessible. We are also dedicated to helping studios share the incredible stories of music that originate in them, generate more bookings, and take their studio business to the world’s most creative and talented artists that search for studios on Studiotime." />
    </div>
    </LayoutWrapperMain>

<LayoutWrapperFooter>
  <Footer />
</LayoutWrapperFooter>
</LayoutSingleColumn>
</StaticPage>
  );
}

export default FrequentlyAskedQuestions;