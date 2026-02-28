import { Moon, Plus } from "lucide-react";

export default function ScheduleManagerPage() {
  return (
    <div className="space-y-10">
      {/* Weekly Defaults */}
      <section>
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Standard Weekly Hours</h3>
        <div className="grid grid-cols-7 gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 text-center">
              <p className="text-xs font-bold text-zinc-500 mb-4">{day}</p>
              <input type="text" defaultValue="09:00" className="bg-transparent w-full text-center font-black text-lg focus:outline-none focus:text-blue-400" />
              <div className="h-px bg-zinc-800 my-2" />
              <input type="text" defaultValue="20:00" className="bg-transparent w-full text-center font-black text-lg focus:outline-none focus:text-blue-400" />
            </div>
          ))}
        </div>
      </section>

      {/* Special Day Overrides */}
      <section className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black uppercase italic">Special Day Overrides</h3>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest"><Plus size={16}/> Add Exception</button>
        </div>
        <div className="space-y-4">
           {/* Row for a "Day Off" */}
           <div className="flex items-center justify-between py-4 border-b border-zinc-800">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-red-500/20 text-red-500 rounded-xl"><Moon size={18}/></div>
               <div>
                 <p className="font-bold">March 8, 2026</p>
                 <p className="text-xs text-zinc-500">Women's Day - Shop Closed</p>
               </div>
             </div>
             <button className="text-zinc-600 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">Remove</button>
           </div>
        </div>
      </section>
    </div>
  );
}