import { useTranslation } from "react-i18next";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const LanguageList = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hr', name: 'Hrvatski' },
    { code: 'it', name: 'Italiano' },
    { code: 'mk', name: 'Македонски' },
    { code: 'sq', name: 'Shqip' },
    { code: 'sr', name: 'Српски' },
    { code: 'tr', name: 'Türkçe' }
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (value: string | null) => {
        const selectedLanguage = value || 'en';
        i18n.changeLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    };

    const currentLanguageName = LanguageList.find(lng => lng.code === i18n?.language)?.name || 'Select Language';

    return (
        <Select
            // Use 'value' instead of 'defaultValue' for a controlled component
            value={i18n?.language || 'en'} 
            onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-45">
                <SelectValue placeholder="Select Language">
                    {currentLanguageName}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {LanguageList.map((lng) => (
                        <SelectItem
                            key={lng.code}
                            value={lng.code}
                            className="cursor-pointer">
                            {lng.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};


export default LanguageSwitcher;
