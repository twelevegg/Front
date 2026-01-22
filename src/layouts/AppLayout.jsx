import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { CoPilotModal } from '../features/copilot/CoPilotModal.jsx';
import Footer from '../components/Footer.jsx';

export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 py-6">
        <div className="grid grid-cols-[260px_1fr] gap-6">
          <Sidebar />

          <div className="rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden flex flex-col min-h-[calc(100vh-48px)]">
            <Topbar pathname={pathname} />

            <div className="p-8 flex-1 min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>

            <Footer />
          </div>
        </div>
      </div>

      <CoPilotModal />
    </div>
  );
}
