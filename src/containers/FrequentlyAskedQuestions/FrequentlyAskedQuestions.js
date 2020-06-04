import React from 'react';
import './FrequentlyAskedQuestions.scss';
import Dropdown from './Dropdown';



function FrequentlyAskedQuestions() {
  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>
        Frequently asked questions{' '}
      </h1>
      <Dropdown title="Select movie" items={items} multiSelect />
    </div>
  );
}

export default FrequentlyAskedQuestions;