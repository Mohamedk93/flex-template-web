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
        role={css.button}
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
           >
          <p className={css.ddheader}>{title}</p>
          <div>{open ? <p className={css.ddheader.arrow.up}></p>: <p className={css.ddheader.arrow.down}></p>}</div>
      {open && (
        <p className={css.text}>
         {items}
        </p>
      )}

</div>
</div>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);