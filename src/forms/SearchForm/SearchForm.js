import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm, Field } from 'react-final-form';
import { intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { Form, LocationAutocompleteInput } from '../../components';

import css from './SearchForm.css';

const identity = v => v;

class SearchFormComponent extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.searchInput = null;
  }

  onChange(location) {
    if (location.selectedPlace) {
      // Note that we use `onSubmit` instead of the conventional
      // `handleSubmit` prop for submitting. We want to autosubmit
      // when a place is selected, and don't require any extra
      // validations for the form.
      this.props.onSubmit({ location });
      // blur search input to hide software keyboard
      if (this.searchInput) {
        this.searchInput.blur();
      }
    }
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={formRenderProps => {
          const { rootClassName, className, desktopInputRoot, intl, isMobile, isSearchBox } = formRenderProps;

          const classes = classNames(rootClassName, className);
          const desktopInputRootClass = desktopInputRoot || css.desktopInputRoot;

          // Allow form submit only when the place has changed
          const preventFormSubmit = e => e.preventDefault();

          return (
            <Form className={classes} onSubmit={preventFormSubmit}>
              <Field
                name="location"
                format={identity}
                render={({ input, meta }) => {
                  const { onChange, ...restInput } = input;

                  // Merge the standard onChange function with custom behaviur. A better solution would
                  // be to use the FormSpy component from Final Form and pass this.onChange to the
                  // onChange prop but that breaks due to insufficient subscription handling.
                  // See: https://github.com/final-form/react-final-form/issues/159
                  const searchOnChange = value => {
                    onChange(value);
                    this.onChange(value);
                  };

                  const searchInput = { ...restInput, onChange: searchOnChange };
                  return (
                    <LocationAutocompleteInput
                      className={isMobile ? css.mobileInputRoot : isSearchBox ? css.searchBoxInputRoot : desktopInputRootClass}
                      iconClassName={isMobile ? css.mobileIcon : isSearchBox ? css.searchBoxIcon : css.desktopIcon}
                      predictionsClassName={
                        isMobile ? css.mobilePredictions: isSearchBox ? css.searchBoxPredictions : css.desktopPredictions
                      }
                      predictionsAttributionClassName={
                        isMobile ? css.mobilePredictionsAttribution : null
                      }
                      placeholder={intl.formatMessage({ id: 'SearchForm.placeholder' })}
                      closeOnBlur={!isMobile}
                      inputRef={node => {
                        this.searchInput = node;
                      }}
                      input={searchInput}
                      meta={meta}
                    />
                  );
                }}
              />
            </Form>
          );
        }}
      />
    );
  }
}

const { func, string, bool } = PropTypes;

SearchFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  desktopInputRoot: null,
  isMobile: false,
};

SearchFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  desktopInputRoot: string,
  onSubmit: func.isRequired,
  isMobile: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SearchForm = injectIntl(SearchFormComponent);

export default SearchForm;
