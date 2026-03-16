import { useEffect, useMemo, useState } from 'react';

import { subscribeToBarbers } from '@/services/barbers';
import { subscribeToServices } from '@/services/service';

export function useBerberData() {
    const [barbers, setBarbers] = useState<IBarber[]>([]);
    const [services, setServices] = useState<IServiceMenu[]>([]);
    const [loading, setLoading] = useState({ barbers: true, services: true });

    useEffect(() => {
        const unsubBarbers = subscribeToBarbers((data) => {
            setBarbers(data);
            setLoading(prev => ({ ...prev, barbers: false }));
        });

        const unsubServices = subscribeToServices((data) => {
            setServices(data);
            setLoading(prev => ({ ...prev, services: false }));
        });

        return () => {
            unsubBarbers();
            unsubServices();
        };
    }, []);

    // Computed Logic
    const stats = useMemo(() => ({
        adminCount: barbers.filter(b => b.role === 'Admin').length,
        hasAdmin: barbers.some(b => b.role === 'Admin'),
        totalStaff: barbers.length,
        totalServices: services.length,
    }), [barbers, services]);

    return {
        barbers,
        services,
        isLoading: loading.barbers || loading.services,
        ...stats
    };
}