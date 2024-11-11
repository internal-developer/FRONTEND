import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/mainPage/main'
import SignUpPage from './pages/signupPage/signup'
import UserInfoPage from './pages/userinfoPage/userinfo'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/signup' element={<SignUpPage/>}></Route>
        <Route path='/main' element={<MainPage/>}></Route>
        <Route path='/userinfo' element={<UserInfoPage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
