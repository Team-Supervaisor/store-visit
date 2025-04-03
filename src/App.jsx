
import { Route, Routes } from 'react-router-dom'
// import './App.css'
import StoreVisitTracking from './components/StoreVisitTracking'
import Stores from './components/Stores'
import ManageStore from './components/ManageStore'
import StoreVisitLoad from './components/StoreVisitLoad'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Stores/>}/>
      <Route path='/store-visit-tracking' element={<StoreVisitTracking/>}/>
      <Route path='/manageStores' element={<ManageStore/>}/>
      <Route path='/storevisit' element={<StoreVisitLoad/>}/>
    {/* <StoreVisitTracking/> */}
    </Routes>
    </>
  )
}

export default App
