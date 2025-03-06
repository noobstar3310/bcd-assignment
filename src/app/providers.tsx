'use client';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, sepolia } from '../config/web3Config';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider 
                    chains={[sepolia]}
                    theme={lightTheme({
                        accentColor: '#4F46E5', // indigo-600 to match your buttons
                        borderRadius: 'medium'
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
} 