import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Hooks & Services
import { useBerberSettings } from "@/hooks/useBerberSettings";
import { cn } from "@/lib/utils";
import { addException, deleteException, updateGlobalHours } from "@/services/settings";

const DEFAULT_GLOBAL_HOURS = { open: "10:00", close: "20:00" };

function ScheduleSettings() {
    const { globalHours, exceptions } = useBerberSettings();

    // Local Form States for Modals
    const [tempGlobal, setTempGlobal] = useState({ open: "", close: "" });
    const [newDate, setNewDate] = useState<Date>();
    const [newHours, setNewHours] = useState({ open: DEFAULT_GLOBAL_HOURS.open, close: DEFAULT_GLOBAL_HOURS.close, note: "", isWorking: true });

    const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

    // Actions
    const handleUpdateGlobal = async () => {
        await updateGlobalHours(tempGlobal);
        setIsGlobalModalOpen(false);
    };

    const handleAddOverride = async () => {
        if (newDate) {
            await addException({
                date: newDate, // Firebase converts JS Date to Timestamp automatically
                open: newHours.open,
                close: newHours.close,
                note: newHours.note,
                isWorking: newHours.isWorking,
            });
            setIsOverrideModalOpen(false);
            setNewDate(undefined);
            setNewHours({ open: "10:00", close: "15:00", note: "", isWorking: true });
        }
    };

    return (
        <section className="relative space-y-6">
            {/* --- SECTION 1: GLOBAL WORKING HOURS --- */}
            <div className="bg-white border border-zinc-100 rounded-[3.5rem] p-10 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <h3 className="text-xl font-black uppercase mb-1">Standard Schedule</h3>
                        <p className="text-zinc-400 text-xxs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                            Default working hours for the shop
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-6 bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100 px-10">
                            <div className="text-center">
                                <p className="text-xxs font-black uppercase text-zinc-400 mb-1">Open</p>
                                <p className="text-3xl font-black">{globalHours.open}</p>
                            </div>
                            <div className="h-10 w-0.5 bg-zinc-200" />
                            <div className="text-center">
                                <p className="text-xxs font-black uppercase text-zinc-400 mb-1">Close</p>
                                <p className="text-3xl font-black">{globalHours.close}</p>
                            </div>
                        </div>

                        <Dialog open={isGlobalModalOpen} onOpenChange={(open) => {
                            if (open) setTempGlobal(globalHours);
                            setIsGlobalModalOpen(open);
                        }}>
                            <DialogTrigger render={
                                <Button className="h-16 px-8 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all" />
                            }>
                                <Pencil size={16} className="mr-2" /> Edit Global
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md rounded-[3rem] p-10">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black uppercase tracking-tighter">Global Hours</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-6">
                                    <div className="space-y-2">
                                        <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Opening</Label>
                                        <Input type="time" value={tempGlobal.open} onChange={(e) => setTempGlobal({ ...tempGlobal, open: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Closing</Label>
                                        <Input type="time" value={tempGlobal.close} onChange={(e) => setTempGlobal({ ...tempGlobal, close: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleUpdateGlobal} className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest">Update Schedule</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: SPECIAL DATES --- */}
            <div className="bg-white border border-zinc-100 rounded-[3.5rem] p-10 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h3 className="text-xl font-black uppercase">Special Dates</h3>
                        <p className="text-zinc-400 text-xxs font-bold uppercase tracking-widest mt-1">Specific overrides for holidays</p>
                    </div>

                    <Dialog open={isOverrideModalOpen} onOpenChange={setIsOverrideModalOpen}>
                        <DialogTrigger render={
                            <Button className="h-16 px-10 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all" />
                        }>
                                <Plus size={18} className="mr-2" strokeWidth={3} /> Add Override
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-[3rem] p-10">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black uppercase tracking-tighter">New Override</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Select Date</Label>
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
                                        <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Open</Label>
                                        <Input type="time" value={newHours.open} onChange={(e) => setNewHours({ ...newHours, open: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Close</Label>
                                        <Input type="time" value={newHours.close} onChange={(e) => setNewHours({ ...newHours, close: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Label (Optional)</Label>
                                    <Input placeholder="e.g. Public Holiday" value={newHours.note} onChange={(e) => setNewHours({ ...newHours, note: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold px-4" />
                                </div>
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Is working</Label>
                                <div className="p-3">
                                    <Switch
                                        id="is-working"
                                        checked={newHours.isWorking ?? true}
                                        onCheckedChange={(checked) => setNewHours({ ...newHours, isWorking: checked })}
                                        className="cursor-pointer"
                                        size="lg"
                                    />
                                </div>
                            </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddOverride} disabled={!newDate} className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest">Save Override</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-[2.5rem] border border-zinc-50 overflow-hidden bg-zinc-50/50">
                    <Table>
                        <TableHeader className="bg-zinc-100/50">
                            <TableRow className="border-none">
                                <TableHead className="font-black uppercase text-xxs tracking-widest h-14 pl-8">Date</TableHead>
                                <TableHead className="font-black uppercase text-xxs tracking-widest h-14 text-center">Hours</TableHead>
                                <TableHead className="font-black uppercase text-xxs tracking-widest h-14">Note</TableHead>
                                <TableHead className="w-20 pr-8 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exceptions.map((exc) => {
                                // 🛡️ CRITICAL: Convert Firestore Timestamp to JS Date
                                const dateObj = exc.date?.toDate ? exc.date.toDate() : new Date(exc.date);

                                return (
                                    <TableRow key={exc.id} className="border-zinc-100/50 hover:bg-white transition-all group">
                                        <TableCell className="font-bold pl-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black uppercase tracking-tight">{format(dateObj, "EEEE")}</span>
                                                <span className="text-xxs text-zinc-400 font-bold uppercase">{format(dateObj, "MMM dd, yyyy")}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-black">
                                            <span className="bg-white border border-zinc-100 px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2">
                                                <Clock size={12} className="text-zinc-400" />
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
                                                onClick={() => exc.id && deleteException(exc.id)}
                                                className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {exceptions.length === 0 && (
                        <div className="py-24 text-center bg-white">
                            <p className="text-zinc-300 font-black uppercase text-xxs tracking-[0.3em]">No custom days set</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ScheduleSettings;