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

    const [formData, setFormData] = useState({
        name: '',
        role: 'Editor',
        bio: '',
    });

    const adminMembers = barbers.filter(b => b.role === 'Admin');
    const hasAdmin = adminMembers.length > 0;

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            setFormData({ name: '', role: 'Editor', bio: '' });
        } catch (error) {
            console.error("Firebase Error:", error);
        }
    };

    return (
        <div className="p-6 md:p-10 w-full max-w-6xl mx-auto">
            {/* --- HEADER --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black leading-none">The Saqo's Team</h2>
                    <p className="text-zinc-400 text-xxs md:text-xs font-bold uppercase tracking-[0.3em]">Access Control & Staff</p>
                </div>


                <Button
                    onClick={() => openAddModal()}
                    className="w-full md:w-auto min-h-14 md:min-h-15 px-8 rounded-xl md:rounded-2xl text-white! font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                    <Plus size={18} strokeWidth={3} /> Add New Member
                </Button>
            </header>

            {/* --- GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                <AnimatePresence mode='popLayout'>
                    {barbers.map((barber) => (
                        <motion.div
                            key={barber.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="group relative bg-white border border-zinc-100 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500"
                        >
                            {/* Card Actions (Mobile Friendly) */}
                            <div className="flex justify-between items-center mb-6">
                                <span className={`text-xxs font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 ${
                                    barber.role === 'Admin' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-600'
                                }`}>
                                    {barber.role === 'Admin' ? <ShieldCheck size={12} /> : <PenTool size={12} />}
                                    {barber.role}
                                </span>

                                {barber.role !== 'Admin' && (
                                    <ConfirmDelete onConfirm={() => barber.id && deleteBarber(barber.id)}>
                                        <button
                                            type="button"
                                            className="p-2.5 bg-red-50 text-red-500 rounded-xl md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </ConfirmDelete>
                                )}
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 md:w-28 md:h-28 bg-zinc-50 border-2 border-zinc-100 rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center mb-6 relative group-hover:border-black transition-all">
                                    <User size={40} className="text-zinc-200 group-hover:text-black transition-colors" />
                                </div>

                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter line-clamp-1">{barber.name}</h3>

                                <p className="text-zinc-500 text-sm font-medium mt-4 mb-6 leading-relaxed px-2 line-clamp-3 min-h-[4.5rem]">
                                    "{barber.bio}"
                                </p>

                                <div className="w-full h-px bg-zinc-50 mb-6" />

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
                <DialogContent className="w-[95vw] sm:max-w-lg rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 bg-white border-none shadow-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                            {editingBarber ? 'Manage Member' : 'New Member'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                        <div className="space-y-4">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center justify-center group cursor-pointer mb-2 text-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 group-hover:border-black group-hover:text-black transition-all">
                                    <Camera size={20} />
                                    <span className="text-[9px] font-black uppercase mt-1 tracking-widest">Upload</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-100 border-none font-bold px-5"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400 ml-1">Permission Level</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value || 'Editor' })}
                                >
                                    <SelectTrigger className="h-12 md:h-14 w-full rounded-xl md:rounded-2xl bg-zinc-100 border-none font-bold px-5">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        {(!hasAdmin || editingBarber?.role === 'Admin') && (
                                            <SelectItem value="Admin" className="font-bold py-3 text-red-600">ADMIN</SelectItem>
                                        )}
                                        <SelectItem value="Editor" className="font-bold py-3">EDITOR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400 ml-1">Bio / Notes</Label>
                                <Textarea
                                    required
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="rounded-xl md:rounded-2xl bg-zinc-100 border-none font-bold min-h-24 md:min-h-32 resize-none p-5"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="submit" className="w-full h-14 md:h-16 bg-black text-white rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest hover:opacity-90">
                                {editingBarber ? 'Update Member' : 'Add to Team'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}