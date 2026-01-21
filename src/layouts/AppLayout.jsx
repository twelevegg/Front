import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { CoPilotModal } from '../features/copilot/CoPilotModal.jsx';

export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-full bg-[var(--app-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 py-6">
        <div className="grid grid-cols-[260px_1fr] gap-6">
          <Sidebar />
          <div className="rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden">
            <Topbar pathname={pathname} />
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* global copilot modal */}
      <CoPilotModal />
    </div>
  );
}
