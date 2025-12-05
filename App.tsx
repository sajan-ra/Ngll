import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Inbox from './pages/Inbox';
import Send from './pages/Send';
import Reply from './pages/Reply';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Inbox />} />
        <Route path="/send" element={<Send />} />
        <Route path="/reply/:id" element={<Reply />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;