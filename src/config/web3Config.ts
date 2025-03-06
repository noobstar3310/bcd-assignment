import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { sepolia } from 'viem/chains';
import { createConfig } from 'wagmi';

const walletConnectProjectId = '14ff0bb587a0b38929bfd4c86b557327';

const { connectors } = getDefaultWallets({
    appName: 'Asset Tracking dApp',
    projectId: walletConnectProjectId,
});

const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http()
    },
    connectors,
});

export { config, sepolia }; 