import './App.css';
import Home from './Pages/Homepage/Homepage.jsx';
import { Route, Routes } from 'react-router-dom'
import Navbar from './Pages/Navbar/Navbar.jsx';
import Login from './Pages/Login/Login.js';
import Register from './Pages/Login/Register.js';
import Footer from './Pages/Footer/Footer.jsx';
import Profile from './Pages/Myaccount/Profile.jsx';
import CourseList from './Pages/courses/CourseList.jsx';
import UnitList from './Pages/unitLists/UnitList.jsx';
import TopicList from './Pages/unitLists/TopicList.jsx';
import TopicContent from './Pages/topicContent/TopicContent.jsx';
import DefaultPage from './Pages/unitLists/DefaultPage.jsx';
import Quiz from './Pages/Quiz/quiz.jsx'
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
        <Route path='/:subjectId/:courseId' element={<UnitList />}>
          <Route path=':topicId' element={<TopicList />}></Route>
          <Route path='' element={<DefaultPage />}></Route>
        </Route>
        <Route path='/:subjectId/:courseId/:topicId/:contentId' element={<TopicContent />}></Route>
        <Route path='/quiz/:topicId' element={<Quiz />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;