import { BrowserRouter, Route, Routes } from 'react-router-dom';

// pages 
import Main from '@pages/main';
import DevicesPage from '@pages/devices-page';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="my-devices/" element={<DevicesPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
