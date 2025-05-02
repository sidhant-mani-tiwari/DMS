
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, Community,MedicalHome } from '../pages';
import { Header,Map,Footer,CommunityHome,
  CommunityForum,CommunityVolunteers,
  CommunityChat, Communities, Medicals ,Incidents
} from '../components';
import {Auth} from '../pages/Auth';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRole } from '../store/roleSlice';
import { Announcements } from '../components/Announcements';
import { Donate } from '../components/Donate';

export const AllRoutes = () => {
    const username= 'Sidhant';
    const isAdmin = useSelector(state => state.roleState.isAdmin);
    const loggedIn = useSelector(state => state.roleState.loggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        // Load authentication state from localStorage on app startup
        const savedState = localStorage.getItem('authState');
        if (savedState) {
            const { isAdmin, role, loggedIn } = JSON.parse(savedState);
            dispatch(changeRole({ isAdmin, role, loggedIn }));
        }
    }, [dispatch]);

    // Save authentication state to localStorage whenever it changes
    useEffect(() => {
        if (loggedIn) {
            localStorage.setItem('authState', JSON.stringify({
                isAdmin,
                role: 'user',
                loggedIn
            }));
        } else {
            localStorage.removeItem('authState');
        }
    }, [isAdmin, loggedIn]);

    const [myLocation, setMyLocation] = useState([23.7264, 90.3925]);
    
 
    const locations = [
      { position: [23.7264, 90.3925], popupText: 'Buet' },
      { position: [23.696789, 90.399721], popupText: 'DU' },
      { position: [23.704783, 90.398183], popupText: 'BD' }
    ];
  return (
    <>
    <Header />
    <Routes>

        <Route path="/" element={  <Home />  } />
        <Route path="/map" element={<Map locations={locations} />} />
        <Route path="/auth" element={<Auth/>} >
            <Route path='login' element={<h1>login</h1>} />
            <Route path='register' element={<h1>Register</h1>} />
            <Route path='*' element={<Navigate to='/' />} />
        </Route>
        <Route path='/community/:id' element={ loggedIn ? <Community /> : <Navigate to="/auth/login"/>} >
            <Route path='' element={< CommunityHome/>} />
            <Route path='chat' element={<CommunityChat/>} />
            <Route path='announcement' element={ < CommunityForum />} />
            <Route path='volunteers' element={ < CommunityVolunteers />} />
            <Route path='*' element={<h1>Access Denied !</h1>} />
        </Route>
        <Route path='/communities' element={<Communities/>} />
        <Route path='/incidents' element={<Incidents/>} />
        <Route path='/medicals' element={ <Medicals/>} />
        <Route path='/medical/:id' element={ <MedicalHome/>} />
        <Route path='/announcements' element={<Announcements />} />
        <Route path='/donate' element={<Donate />} />
        <Route path='*' element={<h1>404 ! Page Not Found</h1>} />
    </Routes>
    <Footer />
      </>
  )
}