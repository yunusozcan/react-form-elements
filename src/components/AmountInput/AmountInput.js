import React, { forwardRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import AmountInputRoot from './AmountInputRoot';
import s from './AmountInput.module.css';

const AmountInput = forwardRef(
  (
    {
      name,
      onChange,
      error = null,
      label = null,
      placeholder = null,
      value = '',
      inputClassName = null,
      labelClassName = null,
      errorClassName = null,
      prepend = null,
      prependClassName = null,
      append = null,
      appendClassName = null,
      disableShrink = false,
      disabled = false,
      ...rest
    },
    inputRef
  ) => {
    const handleChange = useCallback(
      (value, name) => {
        onChange({
          target: {
            name,
            value,
          },
        });
      },
      [onChange]
    );

    const input = useMemo(() => {
      return (
        <AmountInputRoot
          id={name}
          className={cx(s.input, {
            [s.disableShrink]: disableShrink,
            [s.noLabel]: !label,
            [s.disabled]: disabled,
            [inputClassName]: inputClassName,
          })}
          name={name}
          placeholder={placeholder}
          value={value}
          ref={inputRef}
          onValueChange={handleChange}
          disabled={disabled}
          maxLength={10}
          {...rest}
        />
      );
    }, [name, disableShrink, disabled, value, inputRef, handleChange, rest]);

    const labelEl = useMemo(
      () => (
        <label
          htmlFor={name}
          className={cx(s.label, {
            [s.disableShrink]: disableShrink,
            [s.focusedLabel]: label && placeholder && !disableShrink,
            [labelClassName]: labelClassName,
          })}
        >
          {label}
        </label>
      ),
      [name, label, disableShrink]
    );

    return (
      <div className={cx(s.root)}>
        <div className={cx(s.inputRoot)}>
          {prepend && (
            <div className={cx(s.prepend, prependClassName)}>
              {prepend ? prepend : null}
            </div>
          )}

          {append && (
            <div
              className={cx(s.append, {
                [s.appendDisabledShrink]: disableShrink,
                [appendClassName]: appendClassName,
              })}
            >
              {append}
            </div>
          )}

          {label && disableShrink ? labelEl : null}

          {input}

          {label && !disableShrink ? labelEl : null}
        </div>
        {error ? (
          <div
            className={cx(s.errorLabel, { [errorClassName]: errorClassName })}
          >
            {error}
          </div>
        ) : null}
      </div>
    );
  }
);

AmountInput.displayName = 'AmountInput';

AmountInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  prepend: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  prependClassName: PropTypes.string,
  append: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  appendClassName: PropTypes.string,
  disableShrink: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default AmountInput;