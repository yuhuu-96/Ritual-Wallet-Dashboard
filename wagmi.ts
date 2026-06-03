import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, bsc } from '@reown/appkit/networks'

// Dapatkan Project ID dari https://cloud.reown.com
export const projectId = 'YOUR_PROJECT_ID'

export const networks = [mainnet, polygon, bsc]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
})

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: mainnet,
  metadata: {
    name: 'My dApp',
    description: 'My Decentralized Application',
    url: 'https://mydapp.com',
    icons: ['https://mydapp.com/icon.png'],
  },
  features: {
    analytics: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#3B82F6',
    '--w3m-border-radius-master': '12px',
  },
  // Tampilkan wallet tertentu di bagian atas (opsional)
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // OKX Wallet
  ],
})
