
import React, { useState, useMemo } from 'react';
import { useFerry } from '../store/context';
import { 
  Search, Filter, Printer, FileSpreadsheet, 
  ChevronRight, Calendar, CheckSquare, Square, 
  Download, Eye, Trash2, Anchor
} from 'lucide-react';
import { utils, writeFile } from 'xlsx';

const LogHistory: React.FC = () => {
  const { logs, users, ships } = useFerry();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShip, setFilterShip] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const ship = ships.find(s => s.id === log.shipId);
      const captain = users.find(u => u.id === log.captainId);
      const matchesSearch = 
        ship?.name.includes(searchTerm) || 
        captain?.name.includes(searchTerm);
      const matchesShip = !filterShip || log.shipId === filterShip;
      const matchesDate = !filterDate || log.date === filterDate;
      return matchesSearch && matchesShip && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs, searchTerm, filterShip, filterDate, ships, users]);

  const toggleSelectAll = () => {
    if (selectedLogs.size === filteredLogs.length) {
      setSelectedLogs(new Set());
    } else {
      setSelectedLogs(new Set(filteredLogs.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedLogs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLogs(next);
  };

  const exportToExcel = () => {
    if (selectedLogs.size === 0) return;
    
    const dataToExport = logs
      .filter(l => selectedLogs.has(l.id))
      .map(l => {
        const ship = ships.find(s => s.id === l.shipId);
        const captain = users.find(u => u.id === l.captainId);
        const engineer = users.find(u => u.id === l.chiefEngineerId);
        return {
          '날짜': l.date,
          '선박명': ship?.name,
          '선장': captain?.name,
          '기관장': engineer?.name,
          '출발시간': l.departureTime,
          '도착시간': l.arrivalTime || '운항 중',
          '승선인원': l.passengerCount,
          '유류현황': l.fuelStatus,
          '특이사항': l.notes
        };
      });

    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "SailingLogs");
    
    // Add custom branding header if needed (complex with SheetJS basic)
    writeFile(workbook, `운항일지추출_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Search & Action Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-sky-100 flex flex-col lg:flex-row gap-4 no-print">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
          <input 
            type="text"
            placeholder="선박 또는 선장 이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-sky-50 border border-sky-100 rounded-2xl focus:ring-2 focus:ring-sky-200 outline-none font-medium"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterShip}
            onChange={(e) => setFilterShip(e.target.value)}
            className="h-12 px-4 bg-sky-50 border border-sky-100 rounded-2xl text-sm font-bold text-sky-700 outline-none"
          >
            <option value="">전체 선박</option>
            {ships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input 
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="h-12 px-4 bg-sky-50 border border-sky-100 rounded-2xl text-sm font-bold text-sky-700 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToExcel}
            disabled={selectedLogs.size === 0}
            className={`
              flex items-center gap-2 px-6 rounded-2xl font-bold transition-all
              ${selectedLogs.size > 0 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-400'}
            `}
          >
            <FileSpreadsheet size={18} /> 엑셀 저장
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 bg-sky-100 text-sky-700 rounded-2xl font-bold hover:bg-sky-200"
          >
            <Printer size={18} /> 출력
          </button>
        </div>
      </div>

      {/* Selected Items Indicator */}
      {selectedLogs.size > 0 && (
        <div className="flex items-center gap-4 p-4 bg-sky-900 text-white rounded-2xl no-print animate-in fade-in slide-in-from-top-2">
          <CheckSquare size={20} />
          <span className="font-bold">{selectedLogs.size}개의 항목이 선택되었습니다.</span>
          <button onClick={() => setSelectedLogs(new Set())} className="ml-auto text-sky-300 hover:text-white text-sm font-bold">선택 취소</button>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-sky-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-sky-50 border-b border-sky-100">
            <tr>
              <th className="p-4 w-12 text-center no-print">
                <button onClick={toggleSelectAll} className="text-sky-600">
                  {selectedLogs.size === filteredLogs.length && filteredLogs.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
              </th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">일자</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">선박</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">선장/기관장</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest text-center">출발/도착</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest text-center">인원</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest">상태</th>
              <th className="p-4 text-xs font-black text-sky-400 uppercase tracking-widest no-print">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {filteredLogs.map((log) => {
              const ship = ships.find(s => s.id === log.shipId);
              const captain = users.find(u => u.id === log.captainId);
              const engineer = users.find(u => u.id === log.chiefEngineerId);
              const isNavigating = log.departureTime && !log.arrivalTime;

              return (
                <tr key={log.id} className={`hover:bg-sky-50/50 transition-colors ${selectedLogs.has(log.id) ? 'bg-sky-50' : ''}`}>
                  <td className="p-4 text-center no-print">
                    <button onClick={() => toggleSelect(log.id)} className="text-sky-300 hover:text-sky-600">
                      {selectedLogs.has(log.id) ? <CheckSquare size={20} className="text-sky-600" /> : <Square size={20} />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-bold text-sky-900">
                      <Calendar size={14} className="text-sky-300" />
                      {log.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-extrabold text-sky-900">{ship?.name}</div>
                    <div className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">정원 {ship?.capacity}명</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-sky-900">{captain?.name} (선)</span>
                      <span className="text-xs text-sky-500">{engineer?.name} (기)</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-sky-100 rounded-lg shadow-sm">
                      <span className="font-bold text-sky-700">{log.departureTime}</span>
                      <ChevronRight size={12} className="text-sky-300" />
                      <span className={`font-bold ${log.arrivalTime ? 'text-sky-700' : 'text-sky-300 italic'}`}>
                        {log.arrivalTime || '--:--'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-extrabold text-sky-900">{log.passengerCount}</span>
                  </td>
                  <td className="p-4">
                    {isNavigating ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500 text-white rounded-full text-[10px] font-black uppercase tracking-tighter animate-pulse">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        운항중
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        운항완료
                      </span>
                    )}
                  </td>
                  <td className="p-4 no-print">
                    <div className="flex gap-2">
                      <button className="p-2 text-sky-400 hover:text-sky-600 hover:bg-sky-100 rounded-lg transition-all"><Eye size={18} /></button>
                      <button className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div className="p-20 text-center">
            {/* Fix: Added Anchor to imports on line 8 */}
            <Anchor size={48} className="mx-auto text-sky-100 mb-4" />
            <p className="text-sky-400 font-bold">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Print Only Header (Invisible on Web) */}
      <div className="print-only hidden">
        <h1 className="text-center text-3xl font-black mb-8">나미나라공화국 운항 일계표</h1>
        <p className="text-right mb-4">작성일: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default LogHistory;
