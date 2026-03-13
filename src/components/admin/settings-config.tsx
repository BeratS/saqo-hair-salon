import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Clock, Calendar as CalendarIcon, Trash2, Save, MoreHorizontal, Pencil } from 'lucide-react';
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    // Mock State
    const [globalHours, setGlobalHours] = useState({ open: "10:00", close: "20:00" });
    const [exceptions, setExceptions] = useState([
        { id: 1, date: new Date(2026, 3, 20), open: "10:00", close: "15:00", note: "Easter Holiday" },
    ]);

    // Form States
    const [newDate, setNewDate] = useState<Date>();
    const [newHours, setNewHours] = useState({ open: "10:00", close: "15:00", note: "" });
    const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

    const addOverride = () => {
        if (newDate) {
            setExceptions([...exceptions, { id: Date.now(), date: newDate, ...newHours }]);
            setIsOverrideModalOpen(false);
            setNewDate(undefined);
        }
    };

    return (
        <div className="p-10 max-w-5xl mx-auto min-h-screen space-y-12 bg-[#FDFDFD]">
            <header>
                <h2 className="text-6xl font-black uppercase tracking-tighter">Studio Settings</h2>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em] mt-3">Manage Saqo's availability</p>
            </header>

            {/* --- SECTION 1: GLOBAL WORKING HOURS --- */}
            <section className="bg-white border border-zinc-100 rounded-[3.5rem] p-10 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <h3 className="text-xl font-black uppercase mb-1">Standard Schedule</h3>
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                            Mon — Sat default working hours
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-6 bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100 px-10">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Open</p>
                                <p className="text-3xl font-black">{globalHours.open}</p>
                            </div>
                            <div className="h-10 w-[2px] bg-zinc-200" />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Close</p>
                                <p className="text-3xl font-black">{globalHours.close}</p>
                            </div>
                        </div>

                        {/* --- GLOBAL EDIT MODAL --- */}
                        <Dialog open={isGlobalModalOpen} onOpenChange={setIsGlobalModalOpen}>
                            <DialogTrigger render={
                                <Button className="h-16 px-8 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all" />
                            }>
                                <Pencil size={16} className="mr-2" /> Edit Global
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-[3rem] p-10">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black uppercase tracking-tighter">Global Hours</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-6 py-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Opening Time</Label>
                                            <Input type="time" value={globalHours.open} onChange={(e) => setGlobalHours({ ...globalHours, open: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Closing Time</Label>
                                            <Input type="time" value={globalHours.close} onChange={(e) => setGlobalHours({ ...globalHours, close: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setIsGlobalModalOpen(false)} className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest">Update Schedule</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: SPECIAL DATES --- */}
            <section className="bg-white border border-zinc-100 rounded-[3.5rem] p-10 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h3 className="text-xl font-black uppercase">Special Dates</h3>
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Specific overrides for holidays</p>
                    </div>

                    {/* --- OVERRIDE MODAL --- */}
                    <Dialog open={isOverrideModalOpen} onOpenChange={setIsOverrideModalOpen}>
                        <DialogTrigger render={
                            <Button className="h-16 px-10 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 border-none" />
                        }>
                            <Plus size={18} className="mr-2" strokeWidth={3} /> Add Override
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] rounded-[3rem] p-10">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black uppercase tracking-tighter">New Override</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Select Date</Label>
                                    <Popover>
                                        <PopoverTrigger render={
                                            <Button variant="outline" className={cn("w-full h-14 rounded-2xl font-bold border-none bg-zinc-50 justify-start", !newDate && "text-zinc-400")} />
                                        }>
                                            <CalendarIcon className="mr-3 h-4 w-4" />
                                            {newDate ? format(newDate, "PPP") : "Choose a date"}
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-3xl border-none shadow-2xl overflow-hidden">
                                            <Calendar mode="single" selected={newDate} onSelect={setNewDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Open</Label>
                                        <Input type="time" value={newHours.open} onChange={(e) => setNewHours({ ...newHours, open: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Close</Label>
                                        <Input type="time" value={newHours.close} onChange={(e) => setNewHours({ ...newHours, close: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Label (Optional)</Label>
                                    <Input placeholder="Short Day / Holiday" value={newHours.note} onChange={(e) => setNewHours({ ...newHours, note: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold px-4" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={addOverride} disabled={!newDate} className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest">Save Override</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* --- TABLE --- */}
                <div className="rounded-[2.5rem] border border-zinc-50 overflow-hidden bg-zinc-50/50">
                    <Table>
                        <TableHeader className="bg-zinc-100/50">
                            <TableRow className="border-none">
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-14 pl-8">Date</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-14 text-center">New Hours</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-14">Note</TableHead>
                                <TableHead className="w-[80px] pr-8 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exceptions.map((exc) => (
                                <TableRow key={exc.id} className="border-zinc-100/50 hover:bg-white transition-all group">
                                    <TableCell className="font-bold pl-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black uppercase tracking-tight">{format(exc.date, "EEEE")}</span>
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase">{format(exc.date, "MMM dd, yyyy")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-black">
                                        <span className="bg-white border border-zinc-100 px-4 py-2 rounded-xl text-xs">
                                            {exc.open} — {exc.close}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-bold text-xs uppercase tracking-tight text-zinc-500">
                                        {exc.note || "—"}
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setExceptions(exceptions.filter(e => e.id !== exc.id))}
                                            className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {exceptions.length === 0 && (
                        <div className="py-24 text-center bg-white">
                            <p className="text-zinc-300 font-black uppercase text-[10px] tracking-[0.3em]">No custom days set</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}