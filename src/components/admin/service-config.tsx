import { Banknote, Clock, Pencil, Plus, Scissors, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        };

        if (editingService?.id) {
            await updateService(editingService.id, payload);
        } else {
            await addService(payload);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Service Menu</h3>
                    <p className="text-zinc-400 text-xxs font-bold uppercase tracking-widest mt-1">Configure your offerings</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="h-14 px-8 rounded-2xl font-black uppercase text-xxs tracking-widest hover:scale-105 transition-all">
                    <Plus size={18} className="mr-2" /> Add Service
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {(services || [])?.reverse()?.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2.5rem] group hover:bg-zinc-100 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:border-black transition-colors">
                                <Scissors size={20} />
                            </div>
                            <div>
                                <h4 className="font-black uppercase text-sm tracking-tight">{service.name}</h4>
                                <div className="flex gap-4 mt-1">
                                    <span className="flex items-center text-xs font-bold text-zinc-600 uppercase">
                                        <Clock size={12} className="mr-1" /> {service.duration} min
                                    </span>
                                    <span className="flex items-center text-xs font-bold text-zinc-600 uppercase">
                                        <Banknote size={12} className="mr-1" /> {service.price} den
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => handleOpenModal(service)} variant="ghost" size="icon" className="rounded-full hover:bg-white text-zinc-400 hover:text-black">
                                <Pencil size={16} />
                            </Button>
                            <ConfirmDelete
                                onConfirm={() => service.id && deleteService(service.id)}>
                                <Button type="button" variant="ghost" size="icon" className="rounded-full hover:bg-red-50 text-zinc-400 hover:text-red-500">
                                    <Trash2 size={16} />
                                </Button>
                            </ConfirmDelete>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- ADD/EDIT MODAL --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-115.5 rounded-[3rem] p-10">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tighter">
                            {editingService ? 'Edit Service' : 'New Service'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Service Name</Label>
                            <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Skin Fade" className="h-14 rounded-2xl bg-zinc-50 border-none font-bold" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">
                                    Service Description
                                </Label>
                                <span className="text-xxs font-black text-zinc-300 uppercase">Optional</span>
                            </div>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g. Premium fade with line-up and styling advice."
                                className="w-full h-28 p-4 rounded-2xl bg-zinc-50 border-none font-bold text-sm focus:ring-2 focus:ring-black transition-all resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Price (Den)</Label>
                                <Input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="600" className="h-14 rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Duration (Min)</Label>
                                <Input required type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="30" className="h-14 rounded-2xl bg-zinc-50 border-none font-bold text-center" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">
                                    Priority (1 = Top)
                                </Label>
                                <Input
                                    type="number"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: e.target.valueAsNumber })}
                                    placeholder="1"
                                    className="h-14 rounded-2xl bg-zinc-50 border-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xxs font-black uppercase tracking-widest text-zinc-400">Is Premium</Label>
                                <div className="p-3">
                                <Switch id="is-premium"
                                    checked={formData.isPremium}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                                    className="cursor-pointer"
                                    size={'lg'} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest">
                                {editingService ? 'Save Changes' : 'Create Service'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}