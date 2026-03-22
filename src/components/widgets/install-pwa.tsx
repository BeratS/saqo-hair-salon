import { useTranslation } from 'react-i18next';

import { usePWA } from '@/hooks/use-pwa';

import { Button } from '../ui/button';

export function InstallPWA() {
    const { installPrompt, isIOS, isStandalone, handleInstallClick } = usePWA();
    const { t } = useTranslation();

    // If they already installed it, show nothing
    if (isStandalone) return null;

    if (installPrompt) {
        return (
            <Button
                type="button"
                className="min-h-11 bg-green-700 hover:bg-green-800"
                onClick={handleInstallClick}>
                {t('Install App')}
            </Button>
        )
    }

    if (isIOS) {
        return (
            <p className="text-center">
                {t("To install: tap Share and 'Add to Home Screen'")}
            </p>
        )
    }

    return null
}
