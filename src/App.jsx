import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Invoice from './pages/Invoice';

const App = () => {

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/registration' element={<Registration/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<Dashboard/>}/>
    <Route path='/product' element={<Products/>}/>
    <Route path='/inventory' element={<Inventory/>}/>
    <Route path='/invoice' element={<Invoice/>}/>
   </Routes>
   </BrowserRouter>
  );
};

export default App;