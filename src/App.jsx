import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';

const App = () => {

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/registration' element={<Registration/>}/>
    <Route path='/' element={<Dashboard/>}/>
   </Routes>
   </BrowserRouter>
  );
};

export default App;