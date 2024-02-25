import './App.css';
import Home from './Pages/Homepage/Homepage.jsx';
import { Route, Routes } from 'react-router-dom'
import Navbar from './Pages/Navbar/Navbar.jsx';
import Footer from './Pages/Footer/Footer.jsx';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route path='/login' element={<Home />}></Route>
        <Route path='/sugnup' element={<Home />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
