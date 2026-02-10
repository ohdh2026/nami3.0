
import React, { useState } from 'react';
import { useFerry } from '../store/context';
import { UserPlus, Search, UserCheck, ShieldCheck, Mail, MessageCircle, Info } from 'lucide-react';
import { User, UserRole } from '../types';

const UserManagement: React.FC = () => {
  const { users, setUsers } = useFerry();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    role: '승무원',
    telegramChatId: ''
  });

  const handleAddUser = () => {
    if (!newUser.name) return;
    const userToAdd: User = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      role: newUser.role as UserRole,
      telegramChatId: newUser.telegramChatId || '',
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, userToAdd]);
    setIsAdding(false);
    setNewUser({ name: '', role: '승무원', telegramChatId: '' });
  };

  const filteredUsers = users.filter(u => u.name.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
          <input 
            type="text"
            placeholder="회원 이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-sky-100 rounded-2xl focus:ring-2 focus:ring-sky-200 outline-none font-medium"
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 h-12 bg-sky-600 text-white rounded-2xl font-bold shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all"
        >
          <UserPlus size={18} /> 신규 회원 추가
        </button>
      </div>

      {isAdding && (
        <div className="bg-sky-900/50 backdrop-blur-sm fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-sky-900 mb-6">신규 회원 등록</h3>
            <div className="space-y-4">
              <section>
                <label className="block text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">이름</label>
                <input 
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-12 px-4 bg-sky-50 border border-sky-100 rounded-xl outline-none focus:border-sky-500 font-bold"
                />
              </section>
              <section>
                <label className="block text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">권한 등급</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser(p => ({ ...p, role: e.target.value as UserRole }))}
                  className="w-full h-12 px-4 bg-sky-50 border border-sky-100 rounded-xl outline-none font-bold"
                >
                  <option value="관리자">관리자</option>
                  <option value="선장">선장</option>
                  <option value="기관장">기관장</option>
                  <option value="승무원">승무원</option>
                </select>
              </section>
              <section>
                <label className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">
                  <span>Telegram ChatID</span>
                  <div className="group relative">
                    <Info size={14} className="cursor-help" />
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-sky-900 text-white p-2 rounded text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      텔레그램 @userinfobot 을 통해 확인 가능합니다.
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300" size={18} />
                  <input 
                    type="text"
                    placeholder="숫자만 입력"
                    value={newUser.telegramChatId}
                    onChange={(e) => setNewUser(p => ({ ...p, telegramChatId: e.target.value.replace(/\D/g, '') }))}
                    className="w-full h-12 pl-12 pr-4 bg-sky-50 border border-sky-100 rounded-xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>
              </section>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button onClick={() => setIsAdding(false)} className="h-12 border-2 border-sky-100 text-sky-400 font-bold rounded-xl">취소</button>
              <button onClick={handleAddUser} className="h-12 bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-200">추가하기</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 border-b border-sky-100">
            <tr>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">사용자</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">권한 등급</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">Telegram ChatID</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">가입일</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-sky-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center font-bold text-sky-600">
                      {user.name[0]}
                    </div>
                    <span className="font-extrabold text-sky-900">{user.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className={`
                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                    ${user.role === '관리자' ? 'bg-indigo-100 text-indigo-700' : 
                      user.role === '선장' ? 'bg-sky-100 text-sky-700' : 
                      user.role === '기관장' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}
                  `}>
                    {user.role === '관리자' ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
                    {user.role}
                  </div>
                </td>
                <td className="p-4 font-mono text-sm text-sky-600">
                  {user.telegramChatId || <span className="text-gray-300 italic">미등록</span>}
                </td>
                <td className="p-4 text-sm text-sky-500 font-medium">{user.joinedAt}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-bold">정상</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
