import React, { forwardRef, useCallback, useState } from 'react';

import cx from 'clsx';

import Input from '../Input';
import s from './PasswordInput.module.css';

const Index = forwardRef(({ ...rest }, inputRef) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback((e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <Input
      ref={inputRef}
      {...rest}
      type={isOpen ? 'text' : 'password'}
      append={
        <button type="button" className={s.toggle} onClick={handleToggle}>
          <div
            className={cx({
              [s.eyeOpen]: isOpen,
              [s.eyeClose]: !isOpen,
            })}
          >
            <div className={s.iconEye}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-20 -220 320 400"
                width={20}
                height={20}
              >
                <g fill="none" className={s.eye} strokeWidth={40}>
                  <g stroke="currentColor" className={s.eyeLashes}>
                    <path d="M140 90v90M70 60l-60 80M210 60l60 80" />
                  </g>
                  <path
                    stroke="currentColor"
                    d="M0 0q140 190 280 0"
                    className={s.eyeBottom}
                  />
                  <path
                    stroke="currentColor"
                    d="M0 0q140 190 280 0"
                    className={s.eyeTop}
                  />
                  <circle
                    cx={140}
                    r={40}
                    fill="currentColor"
                    className={s.eyePupil}
                  />
                </g>
              </svg>
            </div>
          </div>
        </button>
      }
    />
  );
});

Index.displayName = 'PasswordInput';

export default Index;
