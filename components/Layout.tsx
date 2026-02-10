
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Anchor, LayoutDashboard, Users, Ship, 
  ClipboardList, Send, Settings, LogOut, 
  Menu, X, ShipWheel 
} from 'lucide-react';
import { useFerry } from '../store/context';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, setCurrentUser } = useFerry();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  if (!currentUser) return <>{children}</>;

  const isAdmin = currentUser.role === '관리자';
  const isCaptainOrEngineer = currentUser.role === '선장' || currentUser.role === '기관장';

  const menuItems = [
    { path: '/dashboard', label: '대시보드', icon: LayoutDashboard, roles: ['관리자'] },
    { path: '/entry', label: '운항정보 입력', icon: Anchor, roles: ['관리자', '선장', '기관장'] },
    { path: '/history', label: '운항일지 목록', icon: ClipboardList, roles: ['관리자', '선장', '기관장'] },
    { path: '/users', label: '인력 관리', icon: Users, roles: ['관리자'] },
    { path: '/ships', label: '선박 정보', icon: Ship, roles: ['관리자'] },
    { path: '/telegram', label: '알림 설정', icon: Send, roles: ['관리자'] },
  ].filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="min-h-screen flex bg-sky-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`
        bg-sky-900 text-white w-64 fixed h-full z-50 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-sky-600 rounded-lg shadow-lg">
              <Anchor className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight font-['Space_Grotesk'] uppercase">Ferry</span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${location.pathname === item.path ? 'bg-sky-700 text-white shadow-inner' : 'text-sky-200 hover:bg-sky-800 hover:text-white'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-sky-800">
            <div className="px-4 py-2 mb-4 bg-sky-800/50 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold">
                {currentUser.name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                <p className="text-[10px] text-sky-400 uppercase tracking-widest">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-40 px-6 py-4 flex justify-between items-center no-print">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-sky-900">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-sky-900 hidden md:block">
              {menuItems.find(i => i.path === location.pathname)?.label || '시스템'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              나미나라공화국 운항 중
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1 pb-20">
          {children}
        </main>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none no-print opacity-20">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#bae6fd"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Layout;
