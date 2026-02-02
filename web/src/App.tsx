import { Navigate, Route, Routes } from 'react-router-dom'
import { PeoplePage } from './pages/People/PeoplePage'
import { CategoriesPage } from './pages/Categories/CategoriesPage'
import { TransactionsPage } from './pages/Transactions/TransactionsPage'
import { ReportsPage } from './pages/Reports/ReportsPage'
import './App.css'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/Dashboard/DashboardPage'

function App() {

    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/people" element={<PeoplePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppLayout>
    )
}

export default App
