import { X } from 'lucide-react';
import { motion } from 'motion/react';


export default function AppointmentListPage() {

  return (
    <div className="grid gap-4">
      {/* A Single Appointment Card */}
      <motion.div layout className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex items-center justify-between group hover:border-zinc-700 transition-all">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-2xl">V</div>
          <div>
            <h4 className="font-black text-xl uppercase tracking-tight">Viktor Arsov</h4>
            <p className="text-zinc-500 text-sm font-medium">Haircut + Beard • 16:30 • Saqo Master</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="size-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/50 text-zinc-500 hover:text-red-500 transition-all"><X size={20}/></button>
          <button className="px-8 h-12 rounded-full bg-white text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">Approve</button>
        </div>
      </motion.div>
    </div>
  );
}
