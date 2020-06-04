import React from 'react';
import './FrequentlyAskedQuestions.scss';
import Dropdown from './Dropdown';



function FrequentlyAskedQuestions() {
  return (
    <div className="container">
      <h1 className="pageTitle">Frequently asked questions</h1>
      <Dropdown title="What is Hotdesk?" items="Studiotime is the largest and most trusted online community to book music studios. We have music studios in 35+ countries on our site. We’re a bootstrap marketplace and have successfully generated thousands of bookings in the past two years since we first started. 

Our mission is to help artists further their careers by making home studios to top-line studios all around the world accessible. We are also dedicated to helping studios share the incredible stories of music that originate in them, generate more bookings, and take their studio business to the world’s most creative and talented artists that search for studios on Studiotime." />
    </div>
  );
}

export default FrequentlyAskedQuestions;