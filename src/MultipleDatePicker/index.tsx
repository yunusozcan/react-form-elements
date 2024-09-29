import React, {
  useId,
  forwardRef,
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
  ForwardedRef,
  useImperativeHandle,
} from 'react';

import cx from 'clsx';
import {
  default as ReactSelect,
  components as ReactSelectComponents,
  GroupBase,
  Props,
} from 'react-select';
import makeAnimated from 'react-select/animated';
import { format as dateFNSFormat, type Locale } from 'date-fns';
import { usePopper } from 'react-popper';
import { FocusOn } from 'react-focus-on';

import CalendarRoot from '../Calendar/CalendarRoot';
import s from './MultipleDatePicker.module.css';

const animatedComponents = makeAnimated();

interface Option {
  value: number;
  label: string | JSX.Element;
}

interface MultipleDatePickerProps extends Props {
  name: string;
  onChange: (event: { target: { name: string; value: Date[] } }) => void;
  error?: boolean | string | { message?: string };
  label?: string | null;
  placeholder?: string | null;
  value?: Date[] | undefined;
  locale?: Locale | null;
  format?: string;
  inputClassName?: string | null;
  labelClassName?: string | null;
  errorClassName?: string | null;
  calendarClassName?: string | null;
  disableShrink?: boolean;
  disabled?: boolean;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
}

const MultipleDatePicker = forwardRef<HTMLDivElement, MultipleDatePickerProps>(
  (
    {
      name,
      onChange,
      error = null,
      label = null,
      placeholder = null,
      value = [],
      locale = null,
      format = 'MM/dd/yyyy',
      inputClassName = null,
      labelClassName = null,
      errorClassName = null,
      calendarClassName = undefined,
      disableShrink = false,
      disabled = false,
      classNames = null,
      components = null,
      onFocus = () => ({}),
      onBlur = () => ({}),
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    const [isPopperOpen, setIsPopperOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => inputRef?.current!);
    const popperRef = useRef<HTMLDivElement>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
      null
    );

    const popper = usePopper(popperRef.current, popperElement, {
      placement: 'bottom-end',
    });

    const handleDaySelect = (date: Date[]) => {
      onChange({
        target: {
          name: name,
          value: date,
        },
      });
    };

    const options = value?.map((v, index) => ({
      value: index,
      label: v.toString(),
    }));

    const CustomDropdownIndicator = (props: any) => {
      return (
        <ReactSelectComponents.DropdownIndicator {...props}>
          <svg
            className={s.icon}
            onClick={() => setIsPopperOpen((prevState) => !prevState)}
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <rect width={18} height={18} x={3} y={4} rx={2} ry={2} />
            <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
          </svg>
        </ReactSelectComponents.DropdownIndicator>
      );
    };

    const CustomControl = ({
      innerProps,
      children,
      ...props
    }: {
      innerProps: any;
      children: React.ReactNode;
    }) => {
      return (
        <ReactSelectComponents.Control
          {...props}
          innerProps={{
            ...innerProps,
            onClick: () => {
              setIsPopperOpen((prevState) => !prevState);
            },
          }}
        >
          {children}
        </ReactSelectComponents.Control>
      );
    };

    const handleChange = useCallback(
      (data: Option[]) => {
        onChange({
          target: {
            name: name,
            value: data.map((date) => new Date(date.label)),
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
            [s.disabledLabel]: disabled,
            [s.labelPlaceholder]: label && placeholder && !disableShrink,
            [s.labelFocused]:
              (label && value?.length !== 0 && !!value && !disableShrink) ||
              (label && value?.length !== 0 && !!value && !disableShrink),
            [labelClassName as string]: labelClassName,
          })}
          onClick={() => {
            try {
              const inputs = document.querySelectorAll<HTMLInputElement>(
                `[name="${name}"]`
              );

              if (!inputs.length) {
                return;
              }

              let input = inputs?.[0];

              if (input?.type === 'hidden') {
                input = input?.parentNode?.querySelector('input') || undefined;
              }

              input?.focus();
              inputRef?.current?.focus();
              setIsPopperOpen((prevState) => !prevState);
            } catch (error) {
              throw error;
            }
          }}
        >
          {label}
        </label>
      ),
      [disabled, name, disableShrink, label, labelClassName, placeholder, value]
    );

    useEffect(() => {
      if (!isPopperOpen) {
        inputRef?.current?.blur();
      }
    }, [isPopperOpen]);

    const closePopper = () => {
      setIsPopperOpen(false);
    };

    const errorMessage = useMemo(() => {
      let message: string | null = null;
      if (typeof error === 'string') {
        message = error;
      } else if (error && typeof error === 'object' && error?.message) {
        message = error.message;
      }
      return message;
    }, [error]);

    return (
      <div className={cx(s.root)}>
        <div className={cx(s.inputRoot)}>
          {label && disableShrink ? labelEl : null}
          <div>
            <div ref={popperRef}>
              <ReactSelect<Option, true, GroupBase<Option>>
                instanceId={useId()}
                classNames={{
                  input: () => s.innerInput,
                  menu: () => s.menu,
                  option: (state) =>
                    state.isFocused ? s.optionFocused : s.option,
                  singleValue: () => s.singleValue,
                  placeholder: () => s.placeholder,
                  indicatorSeparator: () => s.indicatorSeparator,
                  indicatorsContainer: () => s.indicatorsContainer,
                  clearIndicator: () => s.clearIndicator,
                  multiValue: () => s.multiValue,
                  valueContainer: () =>
                    label && !disableShrink ? s.valueContainer : '',
                  multiValueRemove: () => s.multiValueRemove,
                  ...classNames,
                  control: (state) =>
                    cx(s.input, {
                      [s.control]: !disableShrink && label,
                      [s.focus]: isPopperOpen,
                      [s.notFocus]: !isPopperOpen,
                      [s.inputError]: typeof error === 'boolean' && error,
                      [s.disabled]: state.isDisabled,
                      [inputClassName as string]: inputClassName,
                      [classNames?.control?.(state)]:
                        classNames?.control?.(state),
                    }),
                }}
                placeholder={placeholder}
                name={name}
                isDisabled={disabled}
                onFocus={(e) => {
                  onFocus(e);
                  setIsPopperOpen(true);
                }}
                onBlur={(e) => {
                  onBlur(e);
                  setIsPopperOpen(false);
                }}
                components={{
                  ...animatedComponents,
                  ...components,
                  Control: CustomControl,
                  DropdownIndicator: CustomDropdownIndicator,
                }}
                {...rest}
                menuIsOpen={false}
                ref={inputRef}
                options={options}
                isMulti
                isSearchable={false}
                value={value?.map((v, index) => ({
                  value: index,
                  label:
                    v instanceof Date
                      ? dateFNSFormat(
                          v,
                          format,
                          locale ? { locale: locale } : {}
                        )
                      : v.toString(),
                }))}
                onChange={handleChange}
              />
            </div>

            {isPopperOpen && (
              <FocusOn
                enabled={isPopperOpen}
                autoFocus
                onClickOutside={closePopper}
                onEscapeKey={closePopper}
                onDeactivation={closePopper}
                scrollLock={false}
              >
                <div
                  className={s.popper}
                  style={popper.styles.popper}
                  {...popper.attributes.popper}
                  ref={setPopperElement}
                  role="dialog"
                  aria-label="Calendar"
                >
                  <CalendarRoot
                    error={error}
                    className={s.calendar}
                    calendarClassName={calendarClassName}
                    disabled={disabled}
                    initialFocus={isPopperOpen}
                    selected={value}
                    onSelect={handleDaySelect}
                    {...rest}
                    mode="multiple"
                  />
                </div>
              </FocusOn>
            )}
          </div>

          {label && !disableShrink ? labelEl : null}
        </div>
        {errorMessage ? (
          <span
            className={cx(s.errorLabel, {
              [errorClassName as string]: errorClassName,
            })}
          >
            {errorMessage}
          </span>
        ) : null}
      </div>
    );
  }
);

MultipleDatePicker.displayName = 'MultipleDatePicker';

export default MultipleDatePicker;
