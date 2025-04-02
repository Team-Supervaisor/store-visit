
import { Route, Routes } from 'react-router-dom'
// import './App.css'
import StoreVisitTracking from './components/StoreVisitTracking'
import Stores from './components/Stores'
import ManageStore from './components/ManageStore'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Stores/>}/>
      <Route path='/store-visit-tracking' element={<StoreVisitTracking/>}/>
      <Route path='/manageStores' element={<ManageStore/>}/>
    {/* <StoreVisitTracking/> */}
    </Routes>
    </>
  )
}

export default App
