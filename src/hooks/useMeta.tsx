import { useEffect } from 'react';

import { Constants } from '@/Constants';

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
                "name": Constants.SITE_TITLE,
                "image": `${Constants.WEBSITE_URL}/og-image.jpg`,
                "url": Constants.WEBSITE_URL,
                "description": "Premium hair salon service specializing in professional hair care and styling.",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": Constants.ADDRESS,
                    "addressCountry": Constants.LOCATION,
                    "phone": Constants.CONTACT_NUMBER,
                    "email": Constants.EMAIL
                }
            });
            document.head.appendChild(script);
        }
    }, [title, description, schemaData]);
};