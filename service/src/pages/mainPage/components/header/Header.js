import React, { useState, useEffect } from 'react'
import './Header.scss'
import defaultProfileImage from '../../../../assets/images/default_profile_image.jpg';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../../api/api';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 데이터 요청
    api.get("/cleanguard")
      .then((response) => {
        setUserInfo(response.data);
        console.log("사용자 정보 가져오기 성공:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const getRoleLabel = (roleName) => {
    switch (roleName) {
      case 'user':
        return '사용자';
      case 'manager':
        return '매니저';
      case 'admin':
        return '관리자';
      default:
        return '';
    }
  };
  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await api.get('/cleanguard/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.log("로그아웃 완료");
      navigate('/signup');
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <div className='header'>
      <div
        className='header-profileBox'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='header-profileBox-name'>{userInfo.name} ({getRoleLabel(userInfo.role.roleName)})</div>
        <div className='header-profileBox-image'>
          <img src={defaultProfileImage} />
        </div>

        {/* profile 클릭 시 뜨는 dropdown 메뉴 */}
        {isOpen && (
          <div className='dropdown'>
            <div className='dropdown-profileBox'>
              <div className='dropdown-profileBox-name'>{userInfo.name}</div>
              <div className='dropdown-profileBox-image'>
                <img src={defaultProfileImage} />
              </div>
            </div>

            <div className='dropdown-linkBox'>
              <Link to="/userinfo" className='dropdown-linkBox-text'>{getRoleLabel(userInfo.role.roleName)}</Link>
              <span className='bar'>|</span>
              <span onClick={handleLogout} className='dropdown-linkBox-text'>카카오로그인</span>
            </div>
            <button onClick={handleLogout} className='dropdown-button'>로그아웃</button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Header