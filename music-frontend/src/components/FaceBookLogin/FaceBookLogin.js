import React from 'react';
import FacebookLoginButton from 'react-facebook-login/dist/facebook-login-render-props';
import { FaFacebookF } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { loginWithFacebook } from '../../store/actions/usersActions';

function FaceBookLogin() {

  const dispatch = useDispatch();

  const cb = facebookData => {
    if (facebookData.id) {
      dispatch(loginWithFacebook(facebookData));
    }
  };

  return (
    <FacebookLoginButton
    appId="221701545569664"
    callback={cb}
    fields="name, email, picture"
    render={renderProps => (
      <button type='button' className="register-btn facebook" onClick={renderProps.onClick}><FaFacebookF size='24px'/> Войти через Facebook</button>
    )}
  />
  )
}

export default FaceBookLogin
