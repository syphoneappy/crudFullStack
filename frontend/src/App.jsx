import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Components/home';
import Dashbord from './Components/dashbord';
import Api from './Components/Api';
import { useDispatch, useSelector } from 'react-redux';
import { adminUser } from './features/counters/CounterSlice';

function App() {
  const dispatch = useDispatch();
  const [tokenChecked, setTokenChecked] = useState(false);
  const user = useSelector((state) => state.user.isAdmin);
  const token = localStorage.getItem("Token");

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await Api.get("/check_access_token/", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          dispatch(adminUser(true));
        } else {
          dispatch(adminUser(false));
        }
      } catch (error) {
        dispatch(adminUser(false));
      } finally {
        setTokenChecked(true);
      }
    }

    checkTokenValidity();
  }, [token, dispatch]);

  if (!tokenChecked) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/tasks' element={user ? <Dashbord /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
