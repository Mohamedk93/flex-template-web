import React, { useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import css from './FrequentlyAskedQuestions.css';

function Dropdown({ title, items, multiSelect = false }) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);
  Dropdown.handleClickOutside = () => setOpen(false);

  
 
  return (
    <div className={css.ddwrapper}>
        <div
        tabIndex={0}
        className={css.ddheader}
        role={css.button}
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
           >
        <div className={css.ddheader}>
          <p className={css.ddheader}>{title}</p>
        </div>
        <div className={css.ddheader}>
          <p>{open ? <i className={css.arrow.up}></i> : <i class={css.arrow.down}></i>}</p>
        </div>
      </div>
      {open && (
        <p className={css.text}>
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