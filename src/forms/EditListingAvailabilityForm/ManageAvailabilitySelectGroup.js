/*
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import React from 'react';
import { arrayOf, bool, node, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';
import moment from 'moment';
import * as validators from '../../util/validators';
import { FieldCheckbox, FieldSelect, ValidationError } from '../../components';

import css from './EditListingAvailabilityForm.css';

const HOUR_FORMAT = 'hh:mm a';

const generateHourOptions = (date, startTime, endTime) => {
  let options = [];
  for (let i = startTime.hour; i <= endTime.hour; i++) {
    // e.g. 00:30 ... 22:30.
    const halfHour24 = `${i >= 10 ? i : `0${i}`}:30`;
    const halfHourHuman = date
      .clone()
      .add(i, 'hours')
      .add(30, 'minutes')
      .format(HOUR_FORMAT);

    const optionHalfHour = (
      <option key={halfHour24} value={halfHour24}>
        {halfHourHuman}
      </option>
    );

    // 00:00 ... 24:00. 24:00 will be converted to the next day 00:00.
    const sharpHour24 = `${i >= 10 ? i : `0${i}`}:00`;
    const sharpHourHuman = date
      .clone()
      .add(i, 'hours')
      .format(HOUR_FORMAT);

    const optionSharpHour = (
      <option key={sharpHour24} value={sharpHour24}>
        {sharpHourHuman}
      </option>
    );

    const startsOnHalfHour = i === startTime.hour && startTime.minute === 30;
    const endsOnSharpHour = i === endTime.hour && endTime.minute === 0;

    // Define order in the option array
    if (startsOnHalfHour) {
      // e.g. ['00:30']
      options.push(optionHalfHour);
    } else if (endsOnSharpHour) {
      // e.g. ['21:00']
      options.push(optionSharpHour);
    } else {
      // e.g. ['01:00', '01:30']
      options.push(optionSharpHour);
      options.push(optionHalfHour);
    }
  }
  return options;
};

const ManageAvailabilitySelectRenderer = props => {
  const {
    className,
    rootClassName,
    label,
    twoColumns,
    id,
    fields,
    options,
    meta,
    values,
    intl,
    availability,
    availabilityPlan,
    listingId,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;
  const hourStartLabel = intl.formatMessage({ id: 'BookingDatesForm.hourStartLabel' });
  const hourStartPlaceholder = intl.formatMessage({ id: 'BookingDatesForm.hourStartPlaceholder' });
  const hourEndLabel = intl.formatMessage({ id: 'BookingDatesForm.hourEndLabel' });
  const hourEndPlaceholder = intl.formatMessage({ id: 'BookingDatesForm.hourEndPlaceholder' });

  const hourStartRequired = validators.required(
    intl.formatMessage({
      id: 'BookingDatesForm.hourStartRequired',
    })
  );

  const hourEndRequired = validators.required(
    intl.formatMessage({
      id: 'BookingDatesForm.hourEndRequired',
    })
  );

  const date = moment('2019-01-01 24:00:00.000');

  return (
    <fieldset className={classes}>
      {label ? <legend>{label}</legend> : null}
      <ul className={listClasses}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          return (
            <li key={fieldId} className={css.item}>
              <label htmlFor="" className={css.label}>{option.label}</label>
              <div className={css.selectHolder}>
                <FieldSelect
                  className={css.hourStart}
                  id={`${id}.startTime`}
                  name={`${option.key}.startTime`}
                  value={`${option.key}.endTime`}
                >
                  <option value="" disabled>
                    {hourStartPlaceholder}
                  </option>
                  {generateHourOptions(date, { hour: 0, minute: 0 }, { hour: 23, minute: 30 })}
                </FieldSelect>
                <FieldSelect
                  className={css.hourEnd}
                  id={`${id}.endTime`}
                  name={`${option.key}.endTime`}
                  value={`${option.key}.endTime`}
                >
                  <option value="" disabled>
                    {hourEndPlaceholder}
                  </option>
                  {generateHourOptions(date, { hour: 0, minute: 30 }, { hour: 24, minute: 0 })}
                </FieldSelect>
              </div>
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={{ ...meta }} />
    </fieldset>
  );
};

ManageAvailabilitySelectRenderer.defaultProps = {
  rootClassName: null,
  className: null,
  label: null,
  twoColumns: false,
};

ManageAvailabilitySelectRenderer.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
    })
  ).isRequired,
  twoColumns: bool,
};

const ManageAvailabilitySelectGroup = props => <FieldArray component={ManageAvailabilitySelectRenderer} {...props} />;

// Name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in
ManageAvailabilitySelectGroup.propTypes = {
  name: string.isRequired,
};

export default ManageAvailabilitySelectGroup;
