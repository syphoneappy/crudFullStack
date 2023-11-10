import './App.css'
import Home from './Components/home'
import Dashbord from './Components/dashbord';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/tasks' element={<Dashbord />}></Route> 
      </Routes>
    </Router>
    </>
  )
}

export default App
