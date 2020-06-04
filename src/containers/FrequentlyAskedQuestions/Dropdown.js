import React, { useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import './FrequentlyAskedQuestions.scss';
import { StaticPage, TopbarContainer } from '..';
import {
    LayoutSingleColumn,
    LayoutWrapperTopbar,
    LayoutWrapperMain,
    LayoutWrapperFooter,
    Footer,
  } from '../../components';

function Dropdown({ title, items, multiSelect = false }) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);
  Dropdown.handleClickOutside = () => setOpen(false);

  
 
  return (
    <StaticPage
    title="FAQs"
    schema={{
      '@context': 'http://schema.org',
      '@type': 'FAQs',
      description: 'Frequently asked questions',
      name: 'Frequently asked questions',
    }}
  >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className="staticPageWrapper">
        
        <div
        tabIndex={0}
        className="dd-header"
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
           >
        <div className="dd-header__title">
          <p className="dd-header__title--bold">{title}}</p>
        </div>
        <div className="dd-header__action">
          <p>{open ? 'Close' : 'Open'}</p>
        </div>
      </div>
      {open && (
        <p className="text">
         {items}
        </p>
      )}
    </LayoutWrapperMain>

<LayoutWrapperFooter>
  <Footer />
</LayoutWrapperFooter>
</LayoutSingleColumn>

</StaticPage>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);