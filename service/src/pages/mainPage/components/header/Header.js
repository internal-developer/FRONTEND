import React, { useState } from 'react'
import './Header.scss'
import defaultProfileImage from '../../../../assets/images/default_profile_image.jpg';
import { Link } from 'react-router-dom';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  return (
    <div className='header'>
      <div
        className='header-profileBox'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='header-profileBox-name'>유저네임</div>
        <div className='header-profileBox-image'>
          <img src={defaultProfileImage} />
        </div>

        {/* profile 클릭 시 뜨는 dropdown 메뉴 */}
        {isOpen && (
          <div className='dropdown'>
            <div className='dropdown-profileBox'>
              <div className='dropdown-profileBox-name'>유저네임</div>
              <div className='dropdown-profileBox-image'>
                <img src={defaultProfileImage} />
              </div>
            </div>

            <div className='dropdown-linkBox'>
              <Link to="/userinfo" className='dropdown-linkBox-text'>사용자</Link>
              <span className='bar'>|</span>
              <Link to="/signup" className='dropdown-linkBox-text'>카카오로그인</Link>
            </div>
            <Link to="/signup"><button className='dropdown-button'>로그아웃</button></Link>

          </div>
        )}

      </div>
    </div>
  )
}

export default Header