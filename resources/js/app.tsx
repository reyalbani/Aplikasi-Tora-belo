import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title,
    resolve: (name) => {
        const pagePromise = resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
        return pagePromise.then((module: any) => {
            const page = module.default;
            
            // Attach persistent layout if not defined
            if (page.layout === undefined || typeof page.layout === 'object') {
                const layoutObj = typeof page.layout === 'object' ? page.layout : {};
                const breadcrumbs = layoutObj.breadcrumbs || [];
                
                if (name.startsWith('auth/')) {
                    page.layout = (pageContent: any) => <AuthLayout children={pageContent} />;
                } else if (name.startsWith('settings/')) {
                    page.layout = (pageContent: any) => (
                        <AppLayout breadcrumbs={breadcrumbs}>
                            <SettingsLayout children={pageContent} />
                        </AppLayout>
                    );
                } else if (name === 'welcome' || name === 'cek-status' || name.startsWith('layanan/') || name.startsWith('skm/')) {
                    // No layout
                } else {
                    page.layout = (pageContent: any) => <AppLayout breadcrumbs={breadcrumbs}>{pageContent}</AppLayout>;
                }
            }
            
            return module;
        });
    },

    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
