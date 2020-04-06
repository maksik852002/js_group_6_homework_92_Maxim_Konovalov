import React from 'react';

const Button = props => (
  <button 
    onClick={props.click?props.click:null}
    className={props.addClass ? `btn ${props.addClass === 'navbar-toggler' ? props.addClass : props.addClass === 'close' ? props.addClass : ['btn', props.addClass].join('-')}` : null}
    type={props.type?props.type:"button"}
    disabled={props.disabled?props.disabled:null}
  >
    {props.label}
  </button>
);

export default Button;