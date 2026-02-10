
import React, { useState, useEffect } from 'react';
import { useFerry } from '../store/context';
import { 
  Clock, Anchor, Users, Fuel, 
  MessageSquare, Save, Archive, UserCheck, 
  RotateCcw, AlertTriangle 
} from 'lucide-react';
import { SailingLog } from '../types';

const LogEntry: React.FC = () => {
  const { currentUser, users, ships, saveLog, logs } = useFerry();
  
  const [formData, setFormData] = useState<Partial<SailingLog>>({
    id: `log-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    departureTime: '',
    arrivalTime: '',
    captainId: currentUser?.role === '선장' ? currentUser.id : '',
    chiefEngineerId: '',
    crewIds: [],
    passengerCount: 0,
    shipId: '',
    fuelStatus: '',
    notes: '',
    isDraft: true
  });

  // LocalStorage persistence for drafts
  useEffect(() => {
    const saved = localStorage.getItem('ferry_current_draft');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('ferry_current_draft', JSON.stringify(formData));
  }, [formData]);

  const captains = users.filter(u => u.role === '선장');
  const engineers = users.filter(u => u.role === '기관장');
  const crews = users.filter(u => u.role === '승무원');

  const isComplete = 
    formData.date && 
    formData.departureTime && 
    formData.arrivalTime && 
    formData.captainId && 
    formData.chiefEngineerId && 
    formData.shipId && 
    formData.passengerCount! > 0 && 
    formData.fuelStatus;

  const handleSetNow = (field: 'departureTime' | 'arrivalTime') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, [field]: timeStr }));
  };

  const handleSave = (asDraft: boolean) => {
    const logToSave = {
      ...formData,
      isDraft: asDraft,
      createdAt: new Date().toISOString()
    } as SailingLog;
    
    saveLog(logToSave);
    alert(asDraft ? '임시저장 되었습니다.' : '정상적으로 저장되었습니다.');
    if (!asDraft) {
      setFormData({
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        departureTime: '',
        arrivalTime: '',
        captainId: currentUser?.role === '선장' ? currentUser.id : '',
        chiefEngineerId: '',
        crewIds: [],
        passengerCount: 0,
        shipId: '',
        fuelStatus: '',
        notes: '',
        isDraft: true
      });
      localStorage.removeItem('ferry_current_draft');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-900/5 p-6 md:p-10 border border-sky-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[100%] -mr-16 -mt-16 z-0" />
        
        <div className="relative z-10">
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-sky-900">운항일지 작성</h2>
            <p className="text-sky-500 font-medium">나미나라공화국 안전 운항의 시작</p>
          </header>

          <div className="grid grid-cols-1 gap-8">
            {/* Ship & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">
                  <Anchor size={16} /> 선박 선택
                </label>
                <select 
                  value={formData.shipId}
                  onChange={(e) => setFormData(p => ({ ...p, shipId: e.target.value }))}
                  className="w-full h-14 px-4 bg-sky-50 border-2 border-sky-100 rounded-2xl focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none transition-all font-bold text-sky-900 appearance-none"
                >
                  <option value="">선박을 선택하세요</option>
                  {ships.map(s => <option key={s.id} value={s.id}>{s.name} (정원 {s.capacity}명)</option>)}
                </select>
              </section>
              <section>
                <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">
                  <Clock size={16} /> 운항 날짜
                </label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                  className="w-full h-14 px-4 bg-sky-50 border-2 border-sky-100 rounded-2xl focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none transition-all font-bold text-sky-900"
                />
              </section>
            </div>

            {/* Departure/Arrival */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">출발시간</label>
                <div className="flex gap-2">
                  <input 
                    type="time" 
                    value={formData.departureTime}
                    onChange={(e) => setFormData(p => ({ ...p, departureTime: e.target.value }))}
                    className="flex-1 h-14 px-4 bg-sky-50 border-2 border-sky-100 rounded-2xl focus:border-sky-500 outline-none font-bold text-sky-900"
                  />
                  <button onClick={() => handleSetNow('departureTime')} className="px-4 bg-sky-600 text-white rounded-2xl font-bold active:scale-95 transition-transform">지금</button>
                </div>
              </section>
              <section>
                <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">도착시간</label>
                <div className="flex gap-2">
                  <input 
                    type="time" 
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData(p => ({ ...p, arrivalTime: e.target.value }))}
                    className="flex-1 h-14 px-4 bg-sky-50 border-2 border-sky-100 rounded-2xl focus:border-sky-500 outline-none font-bold text-sky-900"
                  />
                  <button onClick={() => handleSetNow('arrivalTime')} className="px-4 bg-sky-600 text-white rounded-2xl font-bold active:scale-95 transition-transform">지금</button>
                </div>
              </section>
            </div>

            {/* Crew Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">기관장 선택</label>
                <select 
                  value={formData.chiefEngineerId}
                  onChange={(e) => setFormData(p => ({ ...p, chiefEngineerId: e.target.value }))}
                  className="w-full h-14 px-4 bg-sky-50 border-2 border-sky-100 rounded-2xl focus:border-sky-500 outline-none font-bold text-sky-900"
                >
                  <option value="">기관장을 선택하세요</option>
                  {engineers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </section>
              <section>
                <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">승무원 선택</label>
                <div className="flex flex-wrap gap-2">
                  {crews.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        const current = formData.crewIds || [];
                        const next = current.includes(u.id) ? current.filter(id => id !== u.id) : [...current, u.id];
                        setFormData(p => ({ ...p, crewIds: next }));
                      }}
                      className={`
                        px-4 py-2 rounded-full text-xs font-bold transition-all
                        ${formData.crewIds?.includes(u.id) ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-600 hover:bg-sky-200'}
                      `}
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Passenger & Fuel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">
                  <Users size={16} /> 승선 인원
                </label>
                <input 
                  type="number"
                  placeholder="0"
                  value={formData.passengerCount || ''}
                  onChange={(e) => setFormData(p => ({ ...p, passengerCount: Number(e.target.value) }))}
                  className="w-full h-14 px-4 bg-sky-50 border-2 border-sky-100 rounded-2xl focus:border-sky-500 outline-none font-bold text-sky-900"
                />
              </section>
              <section>
                <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">
                  <Fuel size={16} /> 유류 현황
                </label>
                <input 
                  type="text"
                  placeholder="예: 85% 또는 500L"
                  value={formData.fuelStatus}
                  onChange={(e) => setFormData(p => ({ ...p, fuelStatus: e.target.value }))}
                  className="w-full h-14 px-4 bg-sky-50 border-2 border-sky-100 rounded-2xl focus:border-sky-500 outline-none font-bold text-sky-900"
                />
              </section>
            </div>

            {/* Notes */}
            <section>
              <label className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-2">
                <MessageSquare size={16} /> 특이사항 및 메모
              </label>
              <textarea 
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                placeholder="운항 중 발생한 특이사항이나 점검 내용을 입력하세요."
                className="w-full p-4 bg-sky-50 border-2 border-sky-100 rounded-2xl focus:border-sky-500 outline-none font-medium text-sky-900"
              />
            </section>
          </div>

          {!isComplete && (
            <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl text-amber-800">
              <AlertTriangle size={20} className="shrink-0" />
              <p className="text-xs font-bold leading-relaxed">
                모든 필수 항목(선박, 시간, 인원 등)을 입력해야 최종 저장이 가능합니다. 누락된 정보가 있을 경우 임시저장만 가능합니다.
              </p>
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSave(true)}
              className="h-16 flex items-center justify-center gap-3 bg-white border-2 border-sky-200 text-sky-600 font-extrabold rounded-2xl hover:bg-sky-50 transition-colors"
            >
              <Archive size={20} /> 임시저장
            </button>
            <button
              disabled={!isComplete}
              onClick={() => handleSave(false)}
              className={`
                h-16 flex items-center justify-center gap-3 text-white font-extrabold rounded-2xl transition-all shadow-lg
                ${isComplete ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-200' : 'bg-gray-300 cursor-not-allowed shadow-none'}
              `}
            >
              <Save size={20} /> 최종 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogEntry;
