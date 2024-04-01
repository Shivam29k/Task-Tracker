import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import Signup from './routes/Signup'
import Signin from './routes/Signin'
import Home from './routes/Home'
import Teams from './routes/Teams'
import JoinTeam from './routes/JoinTeam'
import CreateTeam from './routes/CreateTeam'
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/signin' element={<Signin/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/teams' element={<Teams/>} />
          <Route path='/teams/join' element={<JoinTeam/>} />
          <Route path='/teams/create' element={<CreateTeam/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App