import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/candidate/Landing';
import JobListings from './pages/candidate/JobListings';
import Apply from './pages/candidate/Apply';
import Assessment from './pages/candidate/Assessment';
import Applications from './pages/candidate/Applications';
import Dashboard from './pages/hr/Dashboard';
import PostJob from './pages/hr/PostJob';
import CandidateDetail from './pages/hr/CandidateDetail';
import Schedule from './pages/hr/Schedule';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/apply/:jobId" element={<Apply />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/applications" element={<Applications />} />

        <Route path="/hr" element={<Dashboard />} />
        <Route path="/hr/post-job" element={<PostJob />} />
        <Route path="/hr/candidate/:id" element={<CandidateDetail />} />
        <Route path="/hr/schedule" element={<Schedule />} />
      </Routes>
    </BrowserRouter>
  );
}
