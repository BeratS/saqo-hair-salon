import { AnimatePresence, motion } from 'framer-motion';
import { Camera, PenTool, Plus, ShieldCheck, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addBarber, deleteBarber, subscribeToBarbers, updateBarber } from '@/services/barbers';

import ConfirmDelete from '../widgets/confirm-delete';

export default function BarbersConfig() {
    const [barbers, setBarbers] = useState<IBarber[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBarber, setEditingBarber] = useState<IBarber | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: 'Editor',
        bio: '',
    });

    // Simple derived state (No memo needed for small lists)
    const adminMembers = barbers.filter(b => b.role === 'Admin');
    const adminCount = adminMembers.length;
    const hasAdmin = adminCount > 0;

    // Real-time subscription
    useEffect(() => {
        const unsubscribe = subscribeToBarbers((data) => {
            setBarbers(data);
        });
        return () => unsubscribe();
    }, []);

    const openAddModal = () => {
        setEditingBarber(null);
        setFormData({ name: '', role: 'Editor', bio: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (barber: IBarber) => {
        setEditingBarber(barber);
        setFormData({
            name: barber.name,
            role: barber.role,
            bio: barber.bio,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Construct the final object for Firebase
        const barberData: Omit<IBarber, 'id'> = {
            name: formData.name,
            role: formData.role as 'Admin' | 'Editor',
            bio: formData.bio,
            active: true
        };

        try {
            if (editingBarber?.id) {
                await updateBarber(editingBarber.id, barberData);
            } else {
                await addBarber(barberData);
            }
            setIsModalOpen(false);
            setFormData({ name: '', role: 'Editor', bio: '' }); // Reset
        } catch (error) {
            console.error("Firebase Error:", error);
        }
    };

    return (
        <div className="p-10 w-full max-w-5xl mx-auto">
            {/* --- HEADER --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-black">The Saqo's Team</h2>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em] mt-3">Access Control & Staff</p>
                </div>

                <Button
                    onClick={openAddModal}
                    className="h-16 flex items-center gap-3 px-10 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/10"
                >
                    <Plus size={20} strokeWidth={3} /> Add New Member
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
                            className="group relative bg-white border border-zinc-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500"
                        >
                            {barber.role !== 'Admin' && (
                                <ConfirmDelete onConfirm={() => barber.id && deleteBarber(barber.id)}>
                                    <button
                                        type="button"
                                        className="absolute top-8 right-8 p-3 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </ConfirmDelete>
                            )}

                            <div className="flex flex-col items-center text-center">
                                {/* Conditional Badge Logic */}
                                <span className={`absolute top-8 left-8 text-xxs font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 ${barber.role === 'Admin' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-600'
                                    }`}>
                                    {barber.role === 'Admin' ? <ShieldCheck size={12} /> : <PenTool size={12} />}
                                    {barber.role}
                                </span>

                                <div className="h-10" />

                                <div className="w-28 h-28 bg-zinc-50 border-2 border-zinc-100 rounded-[3rem] flex items-center justify-center mb-8 relative group-hover:border-black transition-all">
                                    <User size={48} className="text-zinc-200 group-hover:text-black transition-colors" />
                                </div>

                                <h3 className="text-3xl font-black uppercase tracking-tighter">{barber.name}</h3>

                                <p className="text-zinc-500 text-sm font-medium mt-6 mb-8 leading-relaxed px-2 line-clamp-3">
                                    "{barber.bio}"
                                </p>

                                <div className="w-full h-px bg-zinc-50 mb-8" />

                                <button
                                    type='button'
                                    onClick={() => openEditModal(barber)}
                                    className="w-full py-4 border border-zinc-200 rounded-2xl font-black text-xxs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                >
                                    Edit Permissions
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- MODAL --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-125 rounded-[3rem] p-10 bg-white border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tighter">
                            {editingBarber ? 'Manage Member' : 'New Member'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="space-y-4">
                            {/* Photo Upload Simulation */}
                            <div className="flex flex-col items-center justify-center group cursor-pointer mb-4 text-center">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 group-hover:border-black group-hover:text-black transition-all">
                                    <Camera size={24} />
                                    <span className="text-xxs font-black uppercase mt-1 tracking-widest">Upload Photo</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-14 rounded-2xl bg-zinc-100 border-none font-bold px-6"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400 ml-1">Permission Level</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value || 'Editor' })}
                                >
                                    <SelectTrigger className="min-h-14 w-full rounded-2xl bg-zinc-100 border-none font-bold px-6">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-xl">
                                        {!hasAdmin && (
                                            <SelectItem value="Admin" className="font-bold py-3 text-red-600">ADMIN</SelectItem>
                                        )}
                                        <SelectItem value="Editor" className="font-bold py-3">EDITOR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400 ml-1">Bio / Notes</Label>
                                <Textarea
                                    required
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="rounded-2xl bg-zinc-100 border-none font-bold min-h-32 resize-none p-6"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest">
                                {editingBarber ? 'Update Member' : 'Add to Team'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}