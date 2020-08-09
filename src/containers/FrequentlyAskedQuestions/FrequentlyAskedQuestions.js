import React from 'react';
import css from './FrequentlyAskedQuestions.css';
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
      <h1 className={css.pageTitle}>Frequently Asked Questions</h1>
      <h1 className={css.pagesubTitle}>General Questions</h1>
      <Dropdown title="What is Hotdesk?" items="Hotdesk is the online platform for workspaces. We enable users to book coworking spaces and shared offices worldwide - in 3 clicks. We also enable owners of coworking spaces and shared offices to add their workspaces to be rented by users and make extra income." />

      <Dropdown title="How does Hotdesk work?" items="Users can easily search and flick through our listings and send a booking request in 3 clicks, after having the option of comparing prices, checking images and knowing the amenities offered by the workspace and send a booking request for an hourly, daily or monthly rate. Users can make a search based on their location, such as checking the nearest workspace or in another country." />

      <Dropdown title="What types of workspaces are available on Hotdesk?" items="Hotdesk enables you to book coworking spaces and shared offices. Within these categories, you can choose (i) Hotdesks, (ii) Meeting Rooms, or (iii) Private Offices." />

      <Dropdown title="What are the booking plan durations?" items="You can book workspaces for both the short and long term on Hotdesk, whatever suits you. Plans available are (i) Hourly, (ii) Daily and (iii) Monthly." />

      <Dropdown title="Do I pay extra fees to Hotdesk for booking a workspace?" items="No, not at all. Your payment is exactly what you would pay to regularly book the workspace itself. We do not charge extra fees to our customers, as we make our income directly from the Hosts." />

      <h1 className={css.pagesubTitle}>Questions for Hosts</h1>

      <Dropdown title="How do I add my space? How long does it take?" items="Adding your coworking space or shared offices usually takes 3 - 5 minutes. All you have to do is go to the + Add your workspace section in the main menu, and follow the required steps. You provide information such as the name and location of the workspace, available workspace types and booking plans, amenities and photos - then you're good to go!" />

      <Dropdown title="What are the benefits of adding my workspace to Hotdesk?" items="Adding your workspace to Hotdesk will enable our customers to view and book your listing. It also gives your workspace a digital experience such as enabiling online bookings and payments, as well as automated invoicing." />

      <Dropdown title="Is it free to add my workspace?" items="Yes, it is 100% free to add your coworking space or shared office to Hotdesk's platform. We only earn a 10% commission upon a successful, paid transaction from our customers." />

      <Dropdown title="How do I receive my online payments? What about cash transactions?" items="Customers can either pay directly at your workspace, or online via their credit cards. For credit card transactions, you will receive your money directly to your bank account, minus our 10% commission and bank fees. You have to enable credit card payments from your payout settings. For cash payments, we will arrange with you for the collection of our commission." />

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
