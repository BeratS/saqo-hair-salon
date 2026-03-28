import { Banknote, Clock, Pencil, Plus, Scissors, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { addService, deleteService, subscribeToServices, updateService } from "@/services/service";

import { Switch } from '../ui/switch';
import ConfirmDelete from '../widgets/confirm-delete';

export default function ServiceConfig() {
    const [services, setServices] = useState<IServiceMenu[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<IServiceMenu | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', duration: '', order: 1, isPremium: false
    });

    useEffect(() => {
        const unsubscribe = subscribeToServices(setServices);
        return () => unsubscribe();
    }, []);

    const handleOpenModal = (service?: IServiceMenu) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description || '',
                price: service.price.toString(),
                duration: service.duration.toString(),
                order: Number(service.order) || 1,
                isPremium: service.isPremium || false,
            });
        } else {
            setEditingService(null);
            setFormData({
                name: '', description: '', price: '', duration: '', order: 1, isPremium: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            duration: Number(formData.duration),
            order: Number(formData.order),
            isPremium: formData.isPremium
        };

        if (editingService?.id) {
            await updateService(editingService.id, payload);
        } else {
            await addService(payload);
        }
        setIsModalOpen(false);
    };

    const sortedServices = useMemo(() => {
        return [...services].sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [services]);

    return (
        <div className="bg-white border border-zinc-100 rounded-2xl md:rounded-[3rem] p-5 md:p-10 shadow-sm transition-all">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Service Menu</h3>
                    <p className="text-zinc-400 text-xxs font-bold uppercase tracking-widest mt-1">Configure your offerings</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="w-full md:w-auto min-h-14 md:min-h-15 px-8 rounded-xl md:rounded-2xl text-white! font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                    <Plus size={16} className="mr-2" /> Add Service
                </Button>
            </div>

            {/* SERVICE LIST */}
            <div className="grid grid-cols-1 gap-3 md:gap-4">
                {sortedServices?.map((service) => (
                    <div key={service.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-zinc-50 rounded-2xl md:rounded-[2.5rem] group hover:bg-zinc-100 transition-all gap-4">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className={cn(
                                "w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:border-black transition-colors",
                                service.isPremium ? 'bg-primary/40 border-primary' : 'bg-white'
                            )}>
                                <Scissors size={18} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black uppercase text-sm tracking-tight truncate max-w-45 md:max-w-none">
                                    {service.name}
                                </h4>
                                <div className="flex gap-3 md:gap-4 mt-1">
                                    <span className="flex items-center text-xxs font-bold text-zinc-600 uppercase">
                                        <Clock size={10} className="mr-1" /> {service.duration} min
                                    </span>
                                    <span className="flex items-center text-xxs font-bold text-zinc-600 uppercase">
                                        <Banknote size={10} className="mr-1" /> {service.price} den
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex md:flex-row gap-2 justify-end border-t border-zinc-200/50 md:border-none pt-3 md:pt-0">
                            <Button onClick={() => handleOpenModal(service)} variant="ghost" size="sm" className="flex-1 md:flex-none h-10 rounded-xl md:rounded-full bg-white md:bg-transparent border md:border-none border-zinc-200 text-zinc-400 hover:text-black">
                                <Pencil size={16} className="md:mr-0" />
                                <span className="md:hidden ml-2 font-black uppercase text-[9px]">Edit</span>
                            </Button>
                            <ConfirmDelete onConfirm={() => service.id && deleteService(service.id)}>
                                <Button type="button" variant="ghost" size="sm" className="flex-1 md:flex-none h-10 rounded-xl md:rounded-full bg-white md:bg-transparent border md:border-none border-zinc-200 text-zinc-400 hover:text-red-500">
                                    <Trash2 size={16} className="md:mr-0" />
                                    <span className="md:hidden ml-2 font-black uppercase text-[9px]">Delete</span>
                                </Button>
                            </ConfirmDelete>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- ADD/EDIT MODAL --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[95%] sm:max-w-md rounded-2xl md:rounded-[3rem] p-6 md:p-10 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-left">
                            {editingService ? 'Edit Service' : 'New Service'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 py-2 md:py-4 text-left">
                        <div className="space-y-2">
                            <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Service Name</Label>
                            <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Skin Fade" className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Description</Label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Service details..."
                                className="w-full h-24 p-4 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold text-sm focus:ring-2 focus:ring-black transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Price</Label>
                                <Input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Duration</Label>
                                <Input required type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl md:rounded-2xl">
                            <div className="flex flex-col">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Premium Service</Label>
                                <span className="text-[9px] text-zinc-400">Highlighted in menu</span>
                            </div>
                            <Switch 
                                checked={formData.isPremium} 
                                onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })} 
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="submit" className="w-full h-14 md:h-16 bg-black text-white rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest">
                                {editingService ? 'Save Changes' : 'Create Service'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}