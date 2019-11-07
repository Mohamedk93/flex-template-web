import React from 'react';
import {bool, func, object, shape, string} from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailabilityForm } from '../../forms';

import css from './EditListingAvailabilityPanel.css';

const AVAILABILITY_NAME = 'days';

const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availability,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const usersTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const defaultAvailabilityPlan = {
    type: 'availability-plan/time',
    timezone: usersTimeZone,
    entries: [
      {dayOfWeek: 'mon', seats: 1, startTime: '00:00', endTime: '23:00',},
      {dayOfWeek: 'tue', seats: 1, startTime: '00:00', endTime: '23:00',},
      {dayOfWeek: 'wed', seats: 1, startTime: '00:00', endTime: '23:00',},
      {dayOfWeek: 'thu', seats: 1, startTime: '00:00', endTime: '23:00',},
      {dayOfWeek: 'fri', seats: 1, startTime: '00:00', endTime: '23:00',},
      {dayOfWeek: 'sat', seats: 1, startTime: '00:00', endTime: '23:00',},
      {dayOfWeek: 'sun', seats: 1, startTime: '00:00', endTime: '23:00',},
    ],
  };
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;
  const { publicData } = currentListing.attributes;

  let initialStartTimes = {};
  availabilityPlan.entries.forEach(function(day) {
    initialStartTimes[day.dayOfWeek] = day.startTime 
  });

  let initialEndTimes = {};
  availabilityPlan.entries.forEach(function(day) {
    initialEndTimes[day.dayOfWeek] = day.endTime 
  });

  let initialWeekdays = [];
  availabilityPlan.entries.forEach(function(day) {
    if(day.seats === 1) {
      initialWeekdays.push(day.dayOfWeek);
    }
  });

  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
            <FormattedMessage
              id="EditListingAvailabilityPanel.title"
              values={{listingTitle: <ListingLink listing={listing}/>}}
            />
          ) : (
            <FormattedMessage id="EditListingAvailabilityPanel.createListingTitle"/>
          )}
      </h1>
      <EditListingAvailabilityForm
        className={css.form}
        name={AVAILABILITY_NAME}
        listingId={currentListing.id}
        initialValues={{
          weekdays: initialWeekdays,
          availabilityPlan,
          rental_types: publicData.rentalTypes,

          mon_startTime: initialStartTimes.mon,
          tue_startTime: initialStartTimes.tue,
          wed_startTime: initialStartTimes.wed,
          thu_startTime: initialStartTimes.thu,
          fri_startTime: initialStartTimes.fri,
          sat_startTime: initialStartTimes.sat,
          sun_startTime: initialStartTimes.sun,
          mon_endTime: initialEndTimes.mon,
          tue_endTime: initialEndTimes.tue,
          wed_endTime: initialEndTimes.wed,
          thu_endTime: initialEndTimes.thu,
          fri_endTime: initialEndTimes.fri,
          sat_endTime: initialEndTimes.sat,
          sun_endTime: initialEndTimes.sun,
        }}
        availability={availability}
        availabilityPlan={availabilityPlan}
        onSubmit={(values) => {
          const usersTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          
          const updatedValues = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(function (day) {
            return {
              dayOfWeek: day,
              seats: (values.weekdays.indexOf(day) !== -1) ? 1 : 0,
              // startTime: values[day] ? values[day].startTime : "00:00",
              // endTime: values[day] ? values[day].endTime : "23:00",
              startTime: values[day + "_startTime"] ? values[day + "_startTime"] : "00:00",
              endTime: values[day + "_endTime"] ? values[day + "_endTime"] : "23:00",
            }
          });

          const rentalTypes = values.rental_types ? values.rental_types : [];

          onSubmit({
            availabilityPlan: {
              type: 'availability-plan/time',
              timezone: usersTimeZone,
              entries: updatedValues
            },
            publicData: {
              timezone: usersTimeZone,
              rentalTypes,
              workingSchedule: availabilityPlan,
            }
          });
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  availability: shape({
    calendar: object.isRequired,
    onFetchAvailabilityExceptions: func.isRequired,
    onCreateAvailabilityException: func.isRequired,
    onDeleteAvailabilityException: func.isRequired,
  }).isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
