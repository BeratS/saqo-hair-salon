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
import { useBerberSettings } from "@/hooks/useBerberSettings";
import { cn } from "@/lib/utils";
import { addException, deleteException, updateGlobalHours } from "@/services/settings";

const DEFAULT_GLOBAL_HOURS = { open: "10:00", close: "20:00" };

function ScheduleSettings() {
    const { globalHours, exceptions } = useBerberSettings();

    const [tempGlobal, setTempGlobal] = useState({ open: "", close: "" });
    const [newDate, setNewDate] = useState<Date>();
    const [newHours, setNewHours] = useState({ open: DEFAULT_GLOBAL_HOURS.open, close: DEFAULT_GLOBAL_HOURS.close, note: "", isWorking: true });

    const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

    const handleUpdateGlobal = async () => {
        await updateGlobalHours(tempGlobal);
        setIsGlobalModalOpen(false);
    };

    const handleAddOverride = async () => {
        if (newDate) {
            await addException({
                date: newDate,
                open: newHours.open,
                close: newHours.close,
                note: newHours.note,
                isWorking: newHours.isWorking,
            });
            setIsOverrideModalOpen(false);
            setNewDate(undefined);
            setNewHours({ open: "10:00", close: "20:00", note: "", isWorking: true });
        }
    };

    return (
        <section className="relative space-y-6 sm:px-4 md:px-0">
            {/* --- SECTION 1: GLOBAL WORKING HOURS --- */}
            <div className="bg-white border border-zinc-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase">Standard Schedule</h3>
                        <p className="text-zinc-400 text-xxs md:text-xxs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                            Default working hours for the shop
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-8 w-full lg:w-auto">
                        <div className="flex items-center justify-around md:justify-center gap-4 md:gap-6 bg-zinc-50 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-zinc-100 md:px-10">
                            <div className="text-center">
                                <p className="text-xxs font-black uppercase text-zinc-400 mb-1">Open</p>
                                <p className="text-2xl md:text-3xl font-black">{globalHours.open}</p>
                            </div>
                            <div className="h-10 w-px bg-zinc-200" />
                            <div className="text-center">
                                <p className="text-xxs font-black uppercase text-zinc-400 mb-1">Close</p>
                                <p className="text-2xl md:text-3xl font-black">{globalHours.close}</p>
                            </div>
                        </div>

                        <Dialog open={isGlobalModalOpen} onOpenChange={(open) => {
                            if (open) setTempGlobal(globalHours);
                            setIsGlobalModalOpen(open);
                        }}>
                            <DialogTrigger render={
                                <Button className="h-14 md:h-16 px-8 bg-black text-white rounded-2xl md:rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all w-full sm:w-auto" />
                            }>
                                <Pencil size={16} className="mr-2" /> Edit Global
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-md rounded-3xl md:rounded-[3rem] p-6 md:p-10">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Global Hours</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-6">
                                    <div className="space-y-2">
                                        <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Opening</Label>
                                        <Input type="time" value={tempGlobal.open} onChange={(e) => setTempGlobal({ ...tempGlobal, open: e.target.value })} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Closing</Label>
                                        <Input type="time" value={tempGlobal.close} onChange={(e) => setTempGlobal({ ...tempGlobal, close: e.target.value })} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleUpdateGlobal} className="w-full h-14 md:h-16 bg-black text-white rounded-2xl md:rounded-[2rem] font-black uppercase tracking-widest">Update Schedule</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: SPECIAL DATES --- */}
            <div className="bg-white border border-zinc-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 md:mb-10">
                    <div>
                        <h3 className="text-xl font-black uppercase">Special Dates</h3>
                        <p className="text-zinc-400 text-xxs md:text-xxs font-bold uppercase tracking-widest mt-1">Specific overrides for holidays</p>
                    </div>

                    <Dialog open={isOverrideModalOpen} onOpenChange={setIsOverrideModalOpen}>
                        <DialogTrigger render={
                            <Button className="h-14 md:h-16 px-8 bg-black text-white rounded-2xl md:rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all w-full sm:w-auto" />
                        }>
                            <Plus size={18} className="mr-2" strokeWidth={3} /> Add Override
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-md rounded-3xl md:rounded-[3rem] p-6 md:p-10">
                            <DialogHeader>
                                <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter">New Override</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 md:space-y-6 py-4">
                                <div className="space-y-2">
                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Select Date</Label>
                                    <Popover>
                                        <PopoverTrigger render={
                                            <Button variant="outline" className={cn("w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-bold border-none bg-zinc-50 justify-start px-4", !newDate && "text-zinc-400")} />
                                        }>
                                            <CalendarIcon className="mr-3 h-4 w-4" />
                                            {newDate ? format(newDate, "PPP") : "Choose a date"}
                                        </PopoverTrigger>
                                        <PopoverContent className="w-screen sm:w-auto p-0 rounded-3xl border-none shadow-2xl overflow-hidden" align="center">
                                            <Calendar mode="single" selected={newDate} onSelect={setNewDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Open</Label>
                                        <Input type="time" value={newHours.open} onChange={(e) => setNewHours({ ...newHours, open: e.target.value })} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Close</Label>
                                        <Input type="time" value={newHours.close} onChange={(e) => setNewHours({ ...newHours, close: e.target.value })} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Label (Optional)</Label>
                                    <Input placeholder="e.g. Public Holiday" value={newHours.note} onChange={(e) => setNewHours({ ...newHours, note: e.target.value })} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold px-4" />
                                </div>
                                <div className="flex items-center justify-between p-1">
                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Shop is Open</Label>
                                    <Switch
                                        id="is-working"
                                        checked={newHours.isWorking ?? true}
                                        onCheckedChange={(checked) => setNewHours({ ...newHours, isWorking: checked })}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddOverride} disabled={!newDate} className="w-full h-14 md:h-16 bg-black text-white rounded-2xl md:rounded-[2rem] font-black uppercase tracking-widest">Save Override</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* --- RESPONSIVE TABLE / CARD LIST --- */}
                <div className="rounded-2xl md:rounded-[2.5rem] border border-zinc-50 overflow-hidden bg-zinc-50/50">
                    {/* Desktop View (Table) */}
                    <div className="hidden md:block">
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
                                                <span className={cn(
                                                    "px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 border",
                                                    exc.isWorking === false ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-zinc-100"
                                                )}>
                                                    <Clock size={12} className={exc.isWorking === false ? "text-red-400" : "text-zinc-400"} />
                                                    {exc.isWorking === false ? "CLOSED" : `${exc.open} — ${exc.close}`}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-bold text-xs uppercase tracking-tight text-zinc-500">
                                                {exc.note || "—"}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <Button
                                                    variant="ghost" size="icon"
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
                    </div>

                    {/* Mobile View (Card List) */}
                    <div className="md:hidden divide-y divide-zinc-100">
                        {exceptions.map((exc) => {
                            const dateObj = exc.date?.toDate ? exc.date.toDate() : new Date(exc.date);
                            return (
                                <div key={exc.id} className="p-5 bg-white flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black uppercase leading-none">{format(dateObj, "EEEE, MMM dd")}</p>
                                        <div className="flex items-center gap-2">
                                            <p className={cn(
                                                "text-xxs font-bold px-2 py-0.5 rounded-md",
                                                exc.isWorking === false ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-600"
                                            )}>
                                                {exc.isWorking === false ? "Closed" : `${exc.open} - ${exc.close}`}
                                            </p>
                                            {exc.note && <span className="text-xxs text-zinc-400 italic">"{exc.note}"</span>}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost" size="icon"
                                        onClick={() => exc.id && deleteException(exc.id)}
                                        className="text-zinc-300 hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    {exceptions.length === 0 && (
                        <div className="py-16 md:py-24 text-center bg-white">
                            <p className="text-zinc-300 font-black uppercase text-xxs md:text-xxs tracking-[0.3em]">No custom days set</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ScheduleSettings;