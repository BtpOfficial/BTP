import './App.css';
import Home from './Pages/Homepage/Homepage.jsx';
import { Route, Routes } from 'react-router-dom'
import Navbar from './Pages/Navbar/Navbar.jsx';
import Login from './Pages/Login/Login.js';
import Register from './Pages/Login/Register.js';
import Footer from './Pages/Footer/Footer.jsx';
import Profile from './Pages/Myaccount/Profile.jsx';
import CourseList from './Pages/courses/CourseList.jsx';
import CoursePage from './Pages/courses/CourseList.jsx';
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Register />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/:subjectId' element={<CourseList />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
