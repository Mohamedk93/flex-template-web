import React, { useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import './FrequentlyAskedQuestions.scss';

function Dropdown({ title, items, multiSelect = false }) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);
  Dropdown.handleClickOutside = () => setOpen(false);

  
 
  return (
    <div className="dd-wrapper">
        <div
        tabIndex={0}
        className="dd-header"
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
           >
        <div className="dd-header__title">
          <p className="dd-header__title--bold">{title}</p>
        </div>
        <div className="dd-header__action">
          <p>{open ? <i class="arrow up"></i> : <i class="arrow down"></i>}</p>
        </div>
      </div>
      {open && (
        <p className="text">
         {items}
        </p>
      )}

</div>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);