import React from "react";
import { NavLink } from "react-router-dom";
import { apiURL } from "../../../constants";

const UserMenu = ({click, user, clicked, logout}) => {
  let menu = "dropdown-menu dropdown-menu-right "
  clicked && (menu += " show")
  const path = apiURL + "/uploads/" + user.image;
  return (
    <div onClick = {click} className="user-dropdown">
      <div className="user-wrapper">
        <span className="user-wrapper-item">
          { user.image ?  <img src={!user.facebookId ? path : user.image} alt={"text"} className="rounded-circle w-100"/> : user.displayName[0].toUpperCase() }
        </span>
      </div>
      <div className={menu} style={{minWidth: '13rem'}}>
        <p className='px-3 py-2 m-0'>Привет, <b> {user.displayName || user.username}</b>!</p>
        <div className="dropdown-divider"/>
          <NavLink className="nav-link" to={`/users/${user._id}/history`}>
            История треков
          </NavLink>
          <NavLink className="nav-link" to={`/users/${user._id}/tracks`}>
            Мои треки
          </NavLink>
          <NavLink className="nav-link" to={'/add-artist'}>
            Добавить исполнителя
          </NavLink>
          <NavLink className="nav-link" to={'/add-album'}>
            Добавить альбом
          </NavLink>
          <NavLink className="nav-link" to={'/add-track'}>
            Добавить трек
          </NavLink>
          <div className="dropdown-divider"/>
          <span onClick={logout} className="nav-link" style={{cursor: 'pointer'}}>Выйти</span>
      </div>
    </div>
  );
};

export default UserMenu;
