import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const App = () => {

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/registration' element={<Registration/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<Dashboard/>}/>
   </Routes>
   </BrowserRouter>
  );
};

export default App;