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
                "@type": "HairSalon",
                "name": "Saqo Hair Salon",
                "image": "https://saqo-hair-salon.web.app//og-image.jpg",
                "url": "https://saqo-hair-salon.web.app//",
                "description": "Premium hair salon service specializing in professional hair care and styling.",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Arhiepiskop Dositej 11 skopje, çair 1000",
                    "addressCountry": "Skopje",
                    "phone": "+41 XX XXX XX XX",
                    "email": "saqohairsalon@gmail.com"
                }
            });
            document.head.appendChild(script);
        }
    }, [title, description, schemaData]);
};