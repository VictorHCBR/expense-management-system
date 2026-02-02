import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css';
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeContext.constants.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
)
