import { Clock, MapPin, MessageSquare, Store } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ScheduleSettings from './schedule-settings';

export default function SettingsPage() {

    return (
        /* Reduced padding for mobile (p-6), kept p-10 for desktop */
        <div className="p-2 md:p-10 w-full max-w-5xl mx-auto space-y-8 md:space-y-12 bg-[#FDFDFD]">
            <header className="space-y-2">
                {/* Responsive font size: 3xl on mobile, 5xl on desktop */}
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                    Studio Settings
                </h2>
                <p className="text-zinc-400 text-xxs md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                    Manage Saqo's availability
                </p>
            </header>

            <Tabs defaultValue="schedule" className="space-y-8 md:space-y-10">
                {/* 
                   TAB LIST MOBILE FIXES: 
                   - Removed w-full to allow natural sizing
                   - Added overflow-x-auto and no-scrollbar for swiping on mobile
                */}
                <TabsList className="bg-zinc-100 p-1 rounded-2xl md:rounded-[2rem] min-h-12 flex w-full justify-start overflow-x-auto no-scrollbar">
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
                            className="rounded-xl md:rounded-[1.5rem] px-6 md:px-8 font-black uppercase text-xxs md:text-xxs tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all h-full cursor-pointer whitespace-nowrap"
                        >
                            {tab.icon} {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* --- SCHEDULE CONTENT --- */}
                <TabsContent value="schedule">
                    <ScheduleSettings />
                </TabsContent>

                {/* --- AUTOMATION CONTENT --- */}
                <TabsContent value="notifications" className="space-y-6">
                    <div className="bg-white border border-zinc-100 rounded-3xl md:rounded-[3rem] p-6 md:p-10">
                        <h3 className="text-lg md:text-xl font-black uppercase mb-6 md:mb-8 text-center md:text-left">
                            SMS Automation
                        </h3>
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:p-6 border border-zinc-100 rounded-2xl md:rounded-3xl gap-4">
                                <div className="space-y-1">
                                    <p className="font-black uppercase text-xs tracking-widest">Appointment Reminders</p>
                                    <p className="text-zinc-400 text-xxs md:text-xxs font-bold uppercase tracking-widest">Send SMS 2 hours before the cut</p>
                                </div>
                                <Switch className="scale-90 md:scale-100" />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:p-6 border border-zinc-100 rounded-2xl md:rounded-3xl gap-4">
                                <div className="space-y-1">
                                    <p className="font-black uppercase text-xs tracking-widest">Post-Visit Follow up</p>
                                    <p className="text-zinc-400 text-xxs md:text-xxs font-bold uppercase tracking-widest">Request a review 1 hour after visit</p>
                                </div>
                                <Switch className="scale-90 md:scale-100" />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- STUDIO INFO CONTENT --- */}
                <TabsContent value="branding" className="space-y-6">
                    <div className="bg-white border border-zinc-100 rounded-3xl md:rounded-[3rem] p-6 md:p-10">
                        <h3 className="text-lg md:text-xl font-black uppercase mb-6 md:mb-8 text-center md:text-left">
                            Studio Identity
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xxs md:text-xxs font-black uppercase tracking-widest text-zinc-400">Physical Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                        <Input className="h-12 md:h-14 pl-12 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold text-sm" placeholder="Skopje, Macedonia" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xxs md:text-xxs font-black uppercase tracking-widest text-zinc-400">Instagram Handle</Label>
                                    <div className="relative">
                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                                        <Input className="h-12 md:h-14 pl-12 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold text-sm" placeholder="@saqo_studio" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-50 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 space-y-4">
                                <Label className="text-xxs md:text-xxs font-black uppercase tracking-widest text-zinc-400">App Announcement Banner</Label>
                                <textarea
                                    className="w-full h-24 md:h-32 bg-white border-none rounded-xl md:rounded-2xl p-4 font-bold text-sm focus:ring-black resize-none"
                                    placeholder="e.g. Happy Holidays! We are closed on March 15th."
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}