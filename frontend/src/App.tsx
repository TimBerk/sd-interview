import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TokenEntry } from "./components/TokenEntry";
import { InterviewRoomWrapper } from "./components/InterviewRoomWrapper";
import { ThemeProvider } from "./context/ThemeContext";
import { FlowLayout } from "./components/flow/FlowLayout";
import { CandidatesPage } from "./components/flow/CandidatesPage";
import { CandidateDetailPage } from "./components/flow/CandidateDetailPage";
import { KanbanBoard } from "./components/flow/KanbanBoard";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TokenEntry />} />
          <Route path="/room/:token" element={<InterviewRoomWrapper />} />
          <Route path="/flow" element={<FlowLayout />}>
            <Route index element={<Navigate to="/flow/candidates" replace />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="candidates/:id" element={<CandidateDetailPage />} />
            <Route path="ways" element={<KanbanBoard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
