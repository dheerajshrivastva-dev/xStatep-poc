import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GetCreateForms from './forms/getCreateForms'
import Form from './forms/form'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetCreateForms />} />
        <Route path="create/:formId" element={<Form />} />
        <Route path="create/:formId/:step" element={<Form />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
