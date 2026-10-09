import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// pages 
import Main from '@pages/main';
import DevicesPage from '@pages/devices-page';
import Dashboard from "@pages/dashboard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="devices/:deviceId" element={<DevicesPage />}/>
        <Route path="my-devices/" element={<Navigate to="/dashboard" replace />}/>
        <Route path="dashboard/" element={<Dashboard/>}/>
        <Route path="*" element={<Navigate to="/dashboard" replace />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
