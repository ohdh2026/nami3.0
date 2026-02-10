
import React from 'react';
import { useFerry } from '../store/context';
import { useNavigate } from 'react-router-dom';
import { Ship as ShipIcon, Users, MapPin, Gauge, Clock, ChevronRight, Anchor } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { ships, logs } = useFerry();
  const navigate = useNavigate();

  // "On the way" logic: Departure time exists, but no arrival time.
  const getNavigatingLog = (shipId: string) => {
    return logs.find(log => log.shipId === shipId && log.departureTime && !log.arrivalTime);
  };

  const totalPassengersToday = logs
    .filter(l => l.date === new Date().toISOString().split('T')[0])
    .reduce((sum, l) => sum + l.passengerCount, 0);

  const activeShipsCount = ships.filter(s => getNavigatingLog(s.id)).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 flex items-center gap-6">
          <div className="p-4 bg-sky-100 rounded-2xl text-sky-600">
            <ShipIcon size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-sky-500 uppercase tracking-wider">운항 중인 선박</p>
            <p className="text-3xl font-extrabold text-sky-900">{activeShipsCount} <span className="text-sm font-medium">척</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 flex items-center gap-6">
          <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
            <Users size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-500 uppercase tracking-wider">금일 총 승선객</p>
            <p className="text-3xl font-extrabold text-sky-900">{totalPassengersToday} <span className="text-sm font-medium">명</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 flex items-center gap-6">
          <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
            <Gauge size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-500 uppercase tracking-wider">전체 정원 대비</p>
            <p className="text-3xl font-extrabold text-sky-900">72 <span className="text-sm font-medium">%</span></p>
          </div>
        </div>
      </div>

      {/* Ship Cards */}
      <div>
        <h2 className="text-2xl font-bold text-sky-900 mb-6 flex items-center gap-3">
          <Anchor className="text-sky-600" /> 선단 현황
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ships.map((ship) => {
            const currentLog = getNavigatingLog(ship.id);
            const isNavigating = !!currentLog;
            const occupancy = currentLog ? (currentLog.passengerCount / ship.capacity) * 100 : 0;
            
            return (
              <div 
                key={ship.id}
                onClick={() => isNavigating && navigate('/entry')}
                className={`
                  bg-white rounded-3xl shadow-sm border-2 p-6 transition-all cursor-pointer group
                  ${isNavigating ? 'border-sky-500 ring-4 ring-sky-100' : 'border-sky-50 hover:border-sky-200'}
                `}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-sky-900 mb-1">{ship.name}</h3>
                    <p className="text-sm text-sky-500 font-medium">최대 정원: {ship.capacity}명</p>
                  </div>
                  {isNavigating ? (
                    <span className="flex items-center gap-2 px-3 py-1 bg-sky-500 text-white rounded-full text-xs font-bold animate-pulse">
                      <Clock size={14} /> 운항중
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                      정박중
                    </span>
                  )}
                </div>

                {isNavigating && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-sky-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-sky-400 uppercase">출발시간</p>
                        <p className="text-lg font-bold text-sky-900">{currentLog.departureTime}</p>
                      </div>
                      <div className="bg-sky-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-sky-400 uppercase">승선인원</p>
                        <p className="text-lg font-bold text-sky-900">{currentLog.passengerCount}명</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-sky-600 mb-1">
                        <span>승선 점유율</span>
                        <span>{Math.round(occupancy)}%</span>
                      </div>
                      <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${occupancy > 90 ? 'bg-red-500' : occupancy > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                   <button className="flex items-center gap-1 text-sky-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                     상세정보 {isNavigating ? '및 일지작성' : '보기'} <ChevronRight size={16} />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
