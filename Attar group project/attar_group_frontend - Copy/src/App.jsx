import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppCustomer from "./customer/AppCustomer";
import AppAdmin from "./Admin/AppAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AppAdmin />} />
        <Route path="/*" element={<AppCustomer />} />
      </Routes>
    </Router>
  );
}

export default App;
