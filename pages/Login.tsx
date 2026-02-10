
import React from 'react';
import { useFerry } from '../store/context';
import { Anchor, ShipWheel } from 'lucide-react';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { setCurrentUser, users } = useFerry();

  const handleRoleLogin = (role: UserRole) => {
    const user = users.find(u => u.role === role) || users[0];
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md text-center transform hover:scale-[1.01] transition-transform">
        <div className="inline-flex p-4 bg-sky-100 rounded-full mb-6">
          <Anchor size={48} className="text-sky-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-sky-900 mb-2 font-['Space_Grotesk']">FERRY</h1>
        <p className="text-sky-600 mb-10 font-medium">나미나라공화국 운항팀 항해일지 테스트버전</p>
        
        <div className="space-y-4">
          <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-4">로그인 유형 선택</p>
          {(['관리자', '선장', '기관장', '승무원'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleLogin(role)}
              className="w-full py-4 px-6 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold rounded-2xl border-2 border-transparent hover:border-sky-300 transition-all flex items-center justify-between group"
            >
              <span>{role} 계정으로 시작</span>
              <ShipWheel size={20} className="text-sky-300 group-hover:text-sky-600 transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-sky-100 text-[10px] text-sky-400 uppercase tracking-[0.2em]">
          Powered by Naminara Republic Maritime
        </div>
      </div>
    </div>
  );
};

export default Login;
