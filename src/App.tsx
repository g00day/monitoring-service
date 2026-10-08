import { BrowserRouter, Route, Routes } from 'react-router-dom';

// pages 
import Main from '@pages/main';
import DevicesPage from '@pages/devices-page';
import Dashboard from "@pages/dashboard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="my-devices/" element={<DevicesPage />}/>
        <Route path="dashboard/" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
