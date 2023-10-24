import React, { useCallback, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import cx from 'classnames';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import s from './Select.module.css';

const animatedComponents = makeAnimated();

function RFESelect({
  name,
  onChange,
  error = null,
  label = null,
  options = [],
  placeholder = null,
  value = '',
  inputClassName = null,
  labelClassName = null,
  errorClassName = null,
  disableShrink = false,
  disabled = false,
  classNames = null,
  components = null,
  onFocus = () => {},
  onBlur = () => {},
  ...rest
}) {
  const [focused, setFocus] = useState(false);
  const handleChange = useCallback(
    (option) => {
      onChange({
        target: {
          name,
          value: option,
        },
      });
    },
    [name, onChange]
  );

  const labelEl = useMemo(
    () => (
      <label
        htmlFor={name}
        className={cx(s.label, {
          [s.disableShrink]: disableShrink,
          [s.labelPlaceholder]: label && placeholder && !disableShrink,
          [s.labelFocused]:
            (label && focused && !disableShrink) ||
            (label && value && !disableShrink),
          [labelClassName]: labelClassName,
        })}
        onClick={() => {
          try {
            const inputs = document.querySelectorAll(`[name="${name}"]`);

            if (!inputs.length) {
              return;
            }

            let input = inputs?.[0];

            if (input?.type === 'hidden') {
              input = input?.parentNode?.querySelector('input');
            }

            input?.focus();
          } catch (error) {
            throw error;
          }
        }}
      >
        {label}
      </label>
    ),
    [name, disableShrink, label, focused, labelClassName, placeholder, value]
  );

  return (
    <div className={cx(s.root)}>
      <div className={cx(s.inputRoot)}>
        {label && disableShrink ? labelEl : null}

        <Select
          value={value}
          options={options}
          onChange={handleChange}
          classNames={{
            input: () => s.innerInput,
            container: () => s.container,
            control: (state) =>
              cx(s.input, {
                [s.control]: !disableShrink && label,
                [s.focus]: state.isFocused,
                [s.disabled]: state.isDisabled,
                [inputClassName]: inputClassName,
              }),
            menu: () => s.menu,
            option: (state) => (state.isFocused ? s.optionFocused : s.option),
            singleValue: () => s.singleValue,
            placeholder: () => s.placeholder,
            indicatorSeparator: () => s.indicatorSeparator,
            indicatorsContainer: () => s.indicatorsContainer,
            clearIndicator: () => s.clearIndicator,
            multiValue: () => s.multiValue,
            multiValueRemove: () => s.multiValueRemove,
            ...classNames,
          }}
          placeholder={placeholder}
          name={name}
          isDisabled={disabled}
          onFocus={(e) => {
            onFocus(e);
            setFocus(true);
          }}
          onBlur={(e) => {
            onBlur(e);
            setFocus(false);
          }}
          components={{ ...animatedComponents, ...components }}
          {...rest}
        />

        {label && !disableShrink ? labelEl : null}
      </div>
      {error ? (
        <div className={cx(s.errorLabel, { [errorClassName]: errorClassName })}>
          {error}
        </div>
      ) : null}
    </div>
  );
}

const Option = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
});

RFESelect.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  options: PropTypes.arrayOf(Option),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  disableShrink: PropTypes.bool,
  disabled: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  classNames: PropTypes.object,
  components: PropTypes.object,
};

export default RFESelect;