import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import StrategicLinesTab from "./pages/Dashboard/StrategicLinesTab";
import ProjectsTab from "./pages/Dashboard/ProjectsTab";
import ActionsTab from "./pages/Dashboard/ActionsTab";
import DataEntryTab from "./pages/Dashboard/DataEntryTab";
import WeightingsPage from "./pages/WeightingsPage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<StrategicLinesTab />} />
            <Route path="/proyectos" element={<ProjectsTab />} />
            <Route path="/acciones" element={<ActionsTab />} />
            <Route path="/ingreso-datos" element={<DataEntryTab />} />
            <Route path="/ponderaciones" element={<WeightingsPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
