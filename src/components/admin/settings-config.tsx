import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Instagram, MapPin, MessageSquare, Pencil, Plus, Store, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { Switch } from '../ui/switch';

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
        <div className="p-10 w-full max-w-5xl mx-auto min-h-screen space-y-12 bg-[#FDFDFD]">
            <header>
                <h2 className="text-5xl font-black uppercase tracking-tighter">Studio Settings</h2>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em] mt-3">Manage Saqo's availability</p>
            </header>

            <Tabs defaultValue="schedule" className="space-y-10">
                <TabsList className="bg-zinc-100 p-1 rounded-[2rem] min-h-12 w-full justify-start overflow-x-auto no-scrollbar">
                    {[
                        {
                            value: "schedule",
                            label: "Availability",
                            icon: <Clock className="mr-2 h-4 w-4" />,
                        },
                        {
                            value: "notifications",
                            label: "Automation",
                            icon: <MessageSquare className="mr-2 h-4 w-4" />,
                        },
                        {
                            value: "branding",
                            label: "Studio Info",
                            icon: <Store className="mr-2 h-4 w-4" />,
                        },
                    ].map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-[1.5rem] px-8 font-black uppercase text-xxs tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all h-full cursor-pointer"
                        >
                            {tab.icon} {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* --- 5. STUDIO BOOKING --- */}
                <TabsContent value="schedule" className="space-y-6">
                    {/* --- SECTION 1: GLOBAL WORKING HOURS --- */}
                    <section className="bg-white border border-zinc-100 rounded-[3.5rem] p-10 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div>
                                <h3 className="text-xl font-black uppercase mb-1">Standard Schedule</h3>
                                <p className="text-zinc-400 text-xxs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                                    Mon — Sat default working hours
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

                                {/* --- GLOBAL EDIT MODAL --- */}
                                <Dialog open={isGlobalModalOpen} onOpenChange={setIsGlobalModalOpen}>
                                    <DialogTrigger render={
                                        <Button className="h-16 px-8 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all" />
                                    }>
                                        <Pencil size={16} className="mr-2" /> Edit Global
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-106.25 rounded-[3rem] p-10">
                                        <DialogHeader>
                                            <DialogTitle className="text-3xl font-black uppercase tracking-tighter">Global Hours</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Opening Time</Label>
                                                    <Input type="time" value={globalHours.open} onChange={(e) => setGlobalHours({ ...globalHours, open: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 border-none font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Closing Time</Label>
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
                                <p className="text-zinc-400 text-xxs font-bold uppercase tracking-widest mt-1">Specific overrides for holidays</p>
                            </div>

                            {/* --- OVERRIDE MODAL --- */}
                            <Dialog open={isOverrideModalOpen} onOpenChange={setIsOverrideModalOpen}>
                                <DialogTrigger render={
                                    <Button className="h-16 px-10 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 border-none" />
                                }>
                                    <Plus size={18} className="mr-2" strokeWidth={3} /> Add Override
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-112.5 rounded-[3rem] p-10">
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
                                        <TableHead className="font-black uppercase text-xxs tracking-widest h-14 pl-8">Date</TableHead>
                                        <TableHead className="font-black uppercase text-xxs tracking-widest h-14 text-center">New Hours</TableHead>
                                        <TableHead className="font-black uppercase text-xxs tracking-widest h-14">Note</TableHead>
                                        <TableHead className="w-20 pr-8 text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exceptions.map((exc) => (
                                        <TableRow key={exc.id} className="border-zinc-100/50 hover:bg-white transition-all group">
                                            <TableCell className="font-bold pl-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black uppercase tracking-tight">{format(exc.date, "EEEE")}</span>
                                                    <span className="text-xxs text-zinc-400 font-bold uppercase">{format(exc.date, "MMM dd, yyyy")}</span>
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
                                    <p className="text-zinc-300 font-black uppercase text-xxs tracking-[0.3em]">No custom days set</p>
                                </div>
                            )}
                        </div>
                    </section>
                </TabsContent>

                {/* --- 4. AUTOMATION --- */}
                <TabsContent value="notifications" className="space-y-6">
                    <div className="bg-white border border-zinc-100 rounded-[3rem] p-10">
                        <h3 className="text-xl font-black uppercase mb-8">SMS Automation</h3>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-6 border border-zinc-100 rounded-3xl">
                                <div className="space-y-1">
                                    <p className="font-black uppercase text-xs tracking-widest">Appointment Reminders</p>
                                    <p className="text-zinc-400 text-xxs font-bold uppercase tracking-widest">Send SMS 2 hours before the cut</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between p-6 border border-zinc-100 rounded-3xl">
                                <div className="space-y-1">
                                    <p className="font-black uppercase text-xs tracking-widest">Post-Visit Follow up</p>
                                    <p className="text-zinc-400 text-xxs font-bold uppercase tracking-widest">Request a review 1 hour after visit</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- 5. STUDIO INFO --- */}
                <TabsContent value="branding" className="space-y-6">
                    <div className="bg-white border border-zinc-100 rounded-[3rem] p-10">
                        <h3 className="text-xl font-black uppercase mb-8">Studio Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Physical Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                        <Input className="h-14 pl-12 rounded-2xl bg-zinc-50 border-none font-bold" placeholder="Skopje, Macedonia" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Instagram Handle</Label>
                                    <div className="relative">
                                        <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                        <Input className="h-14 pl-12 rounded-2xl bg-zinc-50 border-none font-bold" placeholder="@saqo_studio" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-50 rounded-[2.5rem] p-8 space-y-4">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">App Announcement Banner</Label>
                                <textarea className="w-full h-24 bg-white border-none rounded-2xl p-4 font-bold text-sm focus:ring-black" placeholder="e.g. Happy Holidays! We are closed on March 15th." />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}