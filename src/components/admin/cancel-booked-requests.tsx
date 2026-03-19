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
            <div className="h-64 flex flex-col items-center justify-center gap-4 bg-zinc-50/50 rounded-[3.5rem] border border-dashed border-zinc-200">
                <Loader2 className="animate-spin text-zinc-300" size={32} />
                <p className="text-xxs font-black uppercase tracking-widest text-zinc-400">Syncing with Database...</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-100 rounded-4xl p-10 shadow-sm transition-all">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
                        Cancellation Requests
                    </h3>
                    <p className="text-zinc-400 text-xxs font-bold uppercase tracking-[0.2em] mt-2">
                        List of cancelled requests
                    </p>
                </div>
                {requests.length > 0 && (
                    <div className="px-4 py-2 bg-black text-white rounded-2xl text-xxs font-black uppercase tracking-widest">
                        {requests.length} New
                    </div>
                )}
            </div>

            <div className="rounded-3xl border border-zinc-50 overflow-hidden bg-zinc-50/30">
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
                                {/* PHONE */}
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

                                {/* REASON */}
                                <TableCell>
                                    <div className="flex items-start gap-3 max-w-md">
                                        <MessageSquare size={14} className="mt-1 text-zinc-300 shrink-0" />
                                        <p className="text-xs font-bold text-zinc-600 leading-relaxed italic">
                                            "{req.reason}"
                                        </p>
                                    </div>
                                </TableCell>

                                {/* DATE */}
                                <TableCell>
                                    <div className="flex items-center gap-2 text-zinc-600">
                                        <Calendar size={12} />
                                        <span className="text-xxs font-black uppercase tracking-tighter">
                                            {req.createdAt?.toDate
                                                ? format(req.createdAt.toDate(), "MMM dd, HH:mm")
                                                : "Just now"}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* DELETE ACTION */}
                                <TableCell className="pr-8 text-right">
                                    <ConfirmDelete onConfirm={() => removeRequestAndAppointments(req.id, req.customerPhone)}>
                                        <Button
                                            type='button'
                                            variant="destructive"
                                            className="rounded-full transition-all"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </Button>
                                    </ConfirmDelete>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {requests.length === 0 && (
                    <div className="py-24 text-center bg-white flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center">
                            <Inbox size={24} className="text-zinc-200" />
                        </div>
                        <p className="text-zinc-200 font-black uppercase text-xxs tracking-[0.4em]">
                            All Caught Up
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}