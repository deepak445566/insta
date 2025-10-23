import React from 'react'
import { Route,  Routes } from 'react-router-dom'
import UserRegister from './components/UserRegister'
import OwnerRegister from './components/OwnerRegister'
import OwnerLogin from './components/OwnerLogin'
import UserLogin from './components/UserLogin'
import Home from './components/Home'
import FoodOwner from './components/FoodOwner'
import Profile from './components/Profile'
import SavedVideos from './components/SavedVideos'

function App() {
  return (
 <>

  <Routes>
    <Route path='/user/register' element={<UserRegister/>}/>
        <Route path='/user/login' element={<UserLogin/>}/>
            <Route path='/owner/register' element={<OwnerRegister/>}/>
                <Route path='/owner/login' element={<OwnerLogin/>}/>
                <Route path='/' element={<Home/>}/>
                <Route path="/create-food" element={<FoodOwner/>}/>
                <Route path="/foodOwner/:id" element={<Profile/>}/>
                   <Route path="/saved" element={<SavedVideos />} />
  </Routes>

 


 
 </>
  )
}

export default App