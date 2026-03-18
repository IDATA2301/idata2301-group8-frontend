import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from "@components/App/App"
import EventPageLoader from "@components/EventPage"
import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/events/:eventslug" element={<EventPageLoader />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
