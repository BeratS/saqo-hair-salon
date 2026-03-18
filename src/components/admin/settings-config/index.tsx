import { Clock, Instagram, MapPin, MessageSquare, Store } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Switch } from '../../ui/switch';
import ScheduleSettings from './schedule-settings';

export default function SettingsPage() {
    
    return (
        <div className="p-10 w-full max-w-5xl mx-auto space-y-12 bg-[#FDFDFD]">
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
                <TabsContent value="schedule">
                    <ScheduleSettings />
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