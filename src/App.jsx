import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import VisitsView from './views/VisitsView';
import AskQuoteView from './views/AskQuoteView';
import RmDealerView from './views/RmDealerView';
import NotificationCenterView from './views/NotificationCenterView';
import PlaceOrderView from './views/PlaceOrderView';
import DealerDetailView from './views/DealerDetailView';
import RaiseIssueView from './views/RaiseIssueView';
import RaiseIssueFormView from './views/RaiseIssueFormView';
import AddTyreView from './views/AddTyreView';
import RmDsrView from './views/RmDsrView';
import SalesInsightView from './views/SalesInsightView';
import SearchView from './views/SearchView';
import FaqView from './views/FaqView';

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/visits" element={<VisitsView />} />
          <Route path="/ask-quote" element={<AskQuoteView />} />
          <Route path="/add-tyre" element={<AddTyreView />} />
          <Route path="/rm-dealers" element={<RmDealerView />} />
          <Route path="/dealer-detail" element={<DealerDetailView />} />
          <Route path="/notifications" element={<NotificationCenterView />} />
          <Route path="/place-order" element={<PlaceOrderView />} />
          <Route path="/raise-issue" element={<RaiseIssueView />} />
          <Route path="/raise-issue/form" element={<RaiseIssueFormView />} />
          <Route path="/dsr" element={<RmDsrView />} />
          <Route path="/sales-insight" element={<SalesInsightView />} />
          <Route path="/search" element={<SearchView />} />
          <Route path="/faq" element={<FaqView />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
