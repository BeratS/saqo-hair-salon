import { format } from 'date-fns';
import { Calendar, Inbox, Loader2, MessageSquare, Phone, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCancelReservations } from "@/hooks/useCancelReservations";

import ConfirmDelete from '../widgets/confirm-delete';

export function CancellBookedRequests() {
    const { requests, loading, removeRequestAndAppointments } = useCancelReservations();

    if (loading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center gap-4 bg-zinc-50/50 rounded-[2rem] md:rounded-[3.5rem] border border-dashed border-zinc-200">
                <Loader2 className="animate-spin text-zinc-300" size={32} />
                <p className="text-xxs font-black uppercase tracking-widest text-zinc-400">Syncing with Database...</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-100 rounded-2xl md:rounded-4xl p-5 md:p-10 shadow-sm transition-all">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-10 gap-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                        Cancellation Requests
                    </h3>
                    <p className="text-zinc-400 text-xxs font-bold uppercase tracking-[0.2em] mt-2">
                        List of cancelled requests
                    </p>
                </div>
                {requests.length > 0 && (
                    <div className="px-3 py-1.5 md:px-4 md:py-2 bg-black text-white rounded-xl md:rounded-2xl text-xxs font-black uppercase tracking-widest">
                        {requests.length} New
                    </div>
                )}
            </div>

            <div className="rounded-2xl md:rounded-3xl border border-zinc-50 overflow-hidden bg-zinc-50/30">
                
                {/* DESKTOP TABLE VIEW */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader className="bg-zinc-100/50">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="font-black uppercase text-xxs tracking-widest h-14 pl-8">Contact</TableHead>
                                <TableHead className="font-black uppercase text-xxs tracking-widest h-14">Reason / Note</TableHead>
                                <TableHead className="font-black uppercase text-xxs tracking-widest h-14">Submitted</TableHead>
                                <TableHead className="w-20 pr-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id} className="border-zinc-100/50 hover:bg-white transition-all group">
                                    <TableCell className="pl-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                <Phone size={12} />
                                            </div>
                                            <span className="text-sm font-black tracking-tighter font-mono">
                                                {req.customerPhone}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-start gap-3 max-w-md">
                                            <MessageSquare size={14} className="mt-1 text-zinc-300 shrink-0" />
                                            <p className="text-xs font-bold text-zinc-600 leading-relaxed italic">
                                                "{req.reason}"
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-zinc-600">
                                            <Calendar size={12} />
                                            <span className="text-xxs font-black uppercase tracking-tighter">
                                                {req.createdAt?.toDate ? format(req.createdAt.toDate(), "MMM dd, HH:mm") : "Just now"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-8 text-right">
                                        <ConfirmDelete onConfirm={() => removeRequestAndAppointments(req.id, req.customerPhone)}>
                                            <Button variant="destructive" className="rounded-full h-9 px-4">
                                                <Trash2 size={14} className="mr-2" /> Delete
                                            </Button>
                                        </ConfirmDelete>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* MOBILE CARD VIEW */}
                <div className="md:hidden flex flex-col divide-y divide-zinc-100">
                    {requests.map((req) => (
                        <div key={req.id} className="p-5 bg-white space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center">
                                        <Phone size={10} />
                                    </div>
                                    <span className="text-sm font-black font-mono tracking-tighter">{req.customerPhone}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-zinc-400">
                                    <Calendar size={10} />
                                    <span className="text-[9px] font-black uppercase">
                                        {req.createdAt?.toDate ? format(req.createdAt.toDate(), "HH:mm") : "Now"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex gap-3">
                                <MessageSquare size={12} className="text-zinc-300 shrink-0 mt-0.5" />
                                <p className="text-[11px] font-bold text-zinc-600 italic leading-snug">"{req.reason}"</p>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                                    {req.createdAt?.toDate ? format(req.createdAt.toDate(), "MMM dd, yyyy") : ""}
                                </span>
                                <ConfirmDelete onConfirm={() => removeRequestAndAppointments(req.id, req.customerPhone)}>
                                    <Button variant="destructive" size="sm" className="rounded-xl h-8 text-xxs font-black uppercase tracking-widest">
                                        <Trash2 size={12} className="mr-2" /> Remove
                                    </Button>
                                </ConfirmDelete>
                            </div>
                        </div>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {requests.length === 0 && (
                    <div className="py-16 md:py-24 text-center bg-white flex flex-col items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-50 rounded-full flex items-center justify-center">
                            <Inbox size={20} className="md:text-24 text-zinc-200" />
                        </div>
                        <p className="text-zinc-200 font-black uppercase text-[9px] md:text-xxs tracking-[0.4em]">
                            All Caught Up
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}