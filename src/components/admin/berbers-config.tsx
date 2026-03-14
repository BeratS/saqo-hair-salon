import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Plus, Scissors, Trash2, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Barber {
    id: number | string;
    name: string;
    role: string;
    bio: string;
    active: boolean;
}

export default function BarbersConfig() {
    const [barbers, setBarbers] = useState<Barber[]>([
        { id: 1, name: 'Saqo Master', role: 'Owner / Lead Barber', bio: 'Master of the blade since 2010.', active: true },
        { id: 2, name: 'Endrit Imeri', role: 'Senior Barber', bio: 'Fades and modern styling expert.', active: true },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
    const [formData, setFormData] = useState({ name: '', role: '', bio: '' });

    // Open modal for NEW barber
    const openAddModal = () => {
        setEditingBarber(null);
        setFormData({ name: '', role: '', bio: '' });
        setIsModalOpen(true);
    };

    // Open modal for EDITING barber
    const openEditModal = (barber: Barber) => {
        setEditingBarber(barber);
        setFormData({ name: barber.name, role: barber.role, bio: barber.bio });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingBarber) {
            // UPDATE EXISTING
            setBarbers(barbers.map(b =>
                b.id === editingBarber.id ? { ...b, ...formData } : b
            ));
        } else {
            // ADD NEW
            const newEntry: Barber = {
                id: Date.now(),
                ...formData,
                active: true
            };
            setBarbers([...barbers, newEntry]);
        }

        setIsModalOpen(false);
    };

    const removeBarber = (id: number | string) => {
        setBarbers(barbers.filter(b => b.id !== id));
    };

    return (
        <div className="p-10 max-w-7xl mx-auto min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">The Saqo's Team</h2>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em] mt-3">Personnel & Roles</p>
                </div>

                <Button
                    onClick={openAddModal}
                    className="h-16 flex items-center gap-3 px-10 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
                >
                    <Plus size={20} strokeWidth={3} /> Add New Barber
                </Button>
            </header>

            {/* --- GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode='popLayout'>
                    {barbers.map((barber) => (
                        <motion.div
                            key={barber.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="group relative bg-white border border-zinc-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500"
                        >
                            <button
                                onClick={() => removeBarber(barber.id)}
                                className="absolute top-8 right-8 p-3 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-28 h-28 bg-zinc-50 border-2 border-zinc-100 rounded-[3rem] flex items-center justify-center mb-8 relative group-hover:border-black transition-all">
                                    <User size={48} className="text-zinc-200 group-hover:text-black transition-colors" />
                                    <div className="absolute -bottom-2 -right-2 bg-black text-white p-2.5 rounded-2xl border-4 border-white shadow-lg">
                                        <Scissors size={16} strokeWidth={2.5} />
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black uppercase tracking-tighter">{barber.name}</h3>
                                <p className="text-xxs font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">{barber.role}</p>

                                <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed px-2">
                                    "{barber.bio}"
                                </p>

                                <div className="w-full h-px bg-zinc-100 mb-8" />

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => openEditModal(barber)}
                                        className="flex-1 py-4 border border-zinc-200 rounded-2xl font-black text-xxs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                    <button className="flex-1 py-4 bg-zinc-100 text-black rounded-2xl font-black text-xxs uppercase tracking-widest hover:bg-zinc-200 transition-all">
                                        Schedule
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- SHARED MODAL --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-125 rounded-[3rem] p-10 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tighter">
                            {editingBarber ? 'Edit Barber' : 'Add New Barber'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex flex-col items-center justify-center group cursor-pointer">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 group-hover:border-black group-hover:text-black transition-all">
                                        <Camera size={24} />
                                        <span className="text-xxxs font-black uppercase mt-1">Photo</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Full Name</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-14 rounded-2xl bg-zinc-50 border-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Role</Label>
                                <Input
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="h-14 rounded-2xl bg-zinc-50 border-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Bio</Label>
                                <Textarea
                                    required
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="rounded-2xl bg-zinc-50 border-none font-bold min-h-25"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest">
                                {editingBarber ? 'Update Profile' : 'Save Profile'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}