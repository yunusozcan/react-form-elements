import React, { useState } from 'react';

import Slider from './index';

const Template = (args) => {
  const [inputs, setInputs] = useState({});
  const onChange = (e) => {
    const { name, value, type } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? !prevState[name] : value,
    }));
  };

  return (
    <>
      <h2>{args.title}</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexDirection: 'column',
        }}
      >
        <Slider
          {...args}
          name="slider"
          label="Slider"
          value={inputs.slider}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export const SliderComponent = Template.bind({});
SliderComponent.args = { title: 'Slider' };

export const SliderComponentDisabled = Template.bind({});
SliderComponentDisabled.args = { title: 'Slider', disabled: true };

export const SliderComponentError = Template.bind({});
SliderComponentError.args = {
  title: 'Slider with error',
  error: 'Error Message',
};

const Component = {
  title: 'Form/Slider',
  component: SliderComponent,
};

export default Component;
