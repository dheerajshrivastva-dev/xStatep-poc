import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GetCreateForms from './forms/getCreateForms'
import Form, { CaptchaForm } from './forms/form'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetCreateForms />} />
        <Route path="create/:formId" element={<Form />} />
        <Route path="create/:formId/:step" element={<Form />} />
        <Route path="create/:formId/captcha/verify" element={<CaptchaForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
