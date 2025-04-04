import { Route, Routes, Navigate } from 'react-router-dom'
import StoreVisitTracking from './components/StoreVisitTracking'
import Stores from './components/Stores'
import ManageStore from './components/ManageStore'
import StoreVisitLoad from './components/StoreVisitLoad'
import LoginModal from './components/LoginModal'
import { useAppContext } from './context'

function App() {
  const { isAuthenticated } = useAppContext();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Stores /> : <Navigate to="/login" replace />
      } />
      <Route path="/login" element={
        !isAuthenticated ? <LoginModal /> : <Navigate to="/" replace />
      } />
      <Route path="/store-visit-tracking" element={
        isAuthenticated ? <StoreVisitTracking /> : <Navigate to="/login" replace />
      } />
      <Route path="/manageStores" element={
        isAuthenticated ? <ManageStore /> : <Navigate to="/login" replace />
      } />
      <Route path="/storevisit" element={
        isAuthenticated ? <StoreVisitLoad /> : <Navigate to="/login" replace />
      } />
    </Routes>
  )
}

export default App
