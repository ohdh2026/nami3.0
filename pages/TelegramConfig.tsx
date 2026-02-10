
import React, { useState } from 'react';
import { useFerry } from '../store/context';
import { 
  Send, Bot, Users, ShieldCheck, 
  Save, Eye, EyeOff, MessageSquare, 
  CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';

const TelegramConfigPage: React.FC = () => {
  const { telegramConfig, setTelegramConfig, users } = useFerry();
  const [token, setToken] = useState(telegramConfig.botToken);
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(telegramConfig.recipients);
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSaveConfig = () => {
    setTelegramConfig({ botToken: token, recipients: selectedUsers });
    alert('설정이 저장되었습니다.');
  };

  const handleTestBot = async () => {
    if (!token) return;
    setIsTesting(true);
    // Mocking API call to telegram
    await new Promise(r => setTimeout(r, 1500));
    setIsTesting(false);
    alert('봇 토큰 연결 확인 성공!');
  };

  const handleSendMessage = async () => {
    if (!message || selectedUsers.length === 0) return;
    setIsSending(true);
    // Mocking mass messaging
    await new Promise(r => setTimeout(r, 2000));
    setIsSending(false);
    setMessage('');
    alert(`${selectedUsers.length}명의 수신자에게 메시지를 발송했습니다.`);
  };

  const usersWithChatId = users.filter(u => u.telegramChatId);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="space-y-8">
        {/* Bot Config */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-sky-100">
          <h2 className="text-2xl font-bold text-sky-900 mb-6 flex items-center gap-3">
            <Bot className="text-sky-600" /> 텔레그램 봇 설정
          </h2>
          <div className="space-y-6">
            <section>
              <label className="block text-sm font-bold text-sky-800 mb-2">Bot API Token</label>
              <div className="relative">
                <input 
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="BotFather에게 받은 토큰을 입력하세요"
                  className="w-full h-14 pl-4 pr-12 bg-sky-50 border-2 border-sky-100 rounded-2xl outline-none focus:border-sky-500 font-mono text-sm"
                />
                <button 
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600"
                >
                  {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-2 text-[10px] text-sky-400 font-medium">관리자 전용 토큰입니다. 노출에 주의하십시오.</p>
            </section>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleTestBot}
                disabled={!token || isTesting}
                className="h-14 flex items-center justify-center gap-2 border-2 border-sky-200 text-sky-600 rounded-2xl font-bold hover:bg-sky-50 transition-all disabled:opacity-50"
              >
                {isTesting ? <Loader2 className="animate-spin" size={20} /> : '연결 테스트'}
              </button>
              <button 
                onClick={handleSaveConfig}
                className="h-14 flex items-center justify-center gap-2 bg-sky-600 text-white rounded-2xl font-bold shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all"
              >
                <Save size={20} /> 설정 저장
              </button>
            </div>
          </div>
        </div>

        {/* Messaging Box */}
        <div className="bg-sky-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600" />
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Send className="text-sky-400" /> 단체 메시지 발송
          </h2>
          <div className="space-y-6 relative z-10">
            <div className="p-4 bg-sky-800/50 rounded-2xl border border-sky-700">
              <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">수신 대상</p>
              <p className="text-lg font-bold">{selectedUsers.length} <span className="text-sm font-medium text-sky-300">명 선택됨</span></p>
            </div>
            <textarea 
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="전달할 메시지를 입력하세요..."
              className="w-full p-4 bg-sky-800 border border-sky-700 rounded-2xl outline-none focus:border-sky-400 text-white placeholder-sky-500 font-medium"
            />
            
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setMessage('📢 금일 기상 악화로 인한 전 선박 서행 운항 바랍니다.')} className="px-3 py-1.5 bg-sky-800 hover:bg-sky-700 rounded-full text-[10px] font-bold border border-sky-700">기상 주의</button>
              <button onClick={() => setMessage('🔔 운항일지 작성이 누락된 선장님께서는 즉시 입력 바랍니다.')} className="px-3 py-1.5 bg-sky-800 hover:bg-sky-700 rounded-full text-[10px] font-bold border border-sky-700">일지 독촉</button>
              <button onClick={() => setMessage('⚓ 정기 점검 일정이 확정되었습니다. 게시판 확인 바랍니다.')} className="px-3 py-1.5 bg-sky-800 hover:bg-sky-700 rounded-full text-[10px] font-bold border border-sky-700">공지 사항</button>
            </div>

            <button 
              onClick={handleSendMessage}
              disabled={!message || selectedUsers.length === 0 || isSending}
              className={`
                w-full h-16 flex items-center justify-center gap-3 font-extrabold rounded-2xl transition-all
                ${!message || selectedUsers.length === 0 ? 'bg-sky-800 text-sky-600 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-950/20'}
              `}
            >
              {isSending ? <Loader2 className="animate-spin" size={24} /> : <><Send size={24} /> 메시지 일괄 전송</>}
            </button>
          </div>
        </div>
      </div>

      {/* Recipient Selection */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-sky-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-sky-900 flex items-center gap-3">
            <Users className="text-sky-600" /> 수신자 관리
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedUsers(usersWithChatId.map(u => u.id))}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              전체 선택
            </button>
            <button 
              onClick={() => setSelectedUsers([])}
              className="text-xs font-bold text-red-400 hover:underline"
            >
              전체 해제
            </button>
          </div>
        </div>
        
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-sky-100">
          {usersWithChatId.length === 0 ? (
            <div className="text-center py-20 bg-sky-50 rounded-3xl">
              <AlertCircle size={48} className="mx-auto text-sky-200 mb-4" />
              <p className="text-sky-400 font-bold">등록된 Telegram ChatID가 없습니다.</p>
              <p className="text-[10px] text-sky-300">인력 관리에서 ID를 먼저 등록하세요.</p>
            </div>
          ) : (
            usersWithChatId.map(user => (
              <div 
                key={user.id}
                onClick={() => {
                  const next = selectedUsers.includes(user.id) ? selectedUsers.filter(id => id !== user.id) : [...selectedUsers, user.id];
                  setSelectedUsers(next);
                }}
                className={`
                  p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4
                  ${selectedUsers.includes(user.id) ? 'border-sky-500 bg-sky-50' : 'border-sky-50 hover:border-sky-100 bg-white'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${selectedUsers.includes(user.id) ? 'bg-sky-600 border-sky-600 text-white' : 'border-sky-200'}
                `}>
                  {selectedUsers.includes(user.id) && <CheckCircle2 size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sky-900">{user.name}</p>
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-tighter">{user.role}</span>
                  </div>
                  <p className="text-[10px] font-mono text-sky-400">ID: {user.telegramChatId}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramConfigPage;
