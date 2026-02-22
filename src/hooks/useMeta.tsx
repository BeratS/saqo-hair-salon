import { useEffect } from 'react';

export const useMeta = (
    title: string,
    description: string,
    schemaData?: Record<string, any>
) => {
    useEffect(() => {
        // Set page title
        document.title = title;

        // 2. Update Meta Description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", description);
        }

        // 3. Add Structured Data (JSON-LD) for Google Indexing
        // This tells Google exactly what your business is.
        const schemaId = "structured-data-home";
        if (!document.getElementById(schemaId)) {
            const script = document.createElement("script");
            script.id = schemaId;
            script.type = "application/ld+json";
            script.innerHTML = JSON.stringify(schemaData ||{
                "@context": "https://schema.org",
                "@type": "AutoTransportService",
                "name": "Auto Transport Irfan",
                "image": "https://auto-transport-irfan.web.app/og-image.jpg",
                "url": "https://auto-transport-irfan.web.app/",
                "description": "Premium auto transport service specializing in safe and reliable vehicle shipping.",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Zurich",
                    "addressCountry": "Switzerland",
                    "phone": "+41 XX XXX XX XX",
                    "email": "autotransportirfan@gmail.com"
                }
            });
            document.head.appendChild(script);
        }
    }, [title, description, schemaData]);
};