# WalletConnect (Reown AppKit) Integration Guide

Integrasi wallet multi-provider ke dApp Anda: MetaMask, OKX Wallet, dan QR Code.

## Tech Stack
- **Reown AppKit** (formerly WalletConnect)
- **Wagmi v2** + **Viem**
- **React** / **Next.js**

---

## 1. Install Dependencies

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
```

---

## 2. Dapatkan Project ID

1. Buka https://cloud.reown.com (dulu cloud.walletconnect.com)
2. Buat project baru
3. Copy **Project ID** Anda

---

## 3. File: `src/config/wagmi.ts`

```ts
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, bsc } from '@reown/appkit/networks'

// Ganti dengan Project ID Anda dari https://cloud.reown.com
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
  // Wallet yang akan ditampilkan (opsional - jika tidak diset, semua wallet ditampilkan)
  // featuredWalletIds: [
  //   'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
  //   'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // OKX
  // ],
})
```

---

## 4. File: `src/providers/Web3Provider.tsx`

```tsx
'use client' // hanya untuk Next.js App Router

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiAdapter } from '../config/wagmi'
import '../config/wagmi' // pastikan modal terinisialisasi

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

---

## 5. File: `src/components/ConnectButton.tsx`

```tsx
'use client'

import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useDisconnect } from 'wagmi'

export function ConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg">
          {shortAddress}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => open()}
      className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
    >
      Connect Wallet
    </button>
  )
}
```

---

## 6. Wrap App di `layout.tsx` (Next.js) atau `main.tsx` (React)

### Next.js App Router — `app/layout.tsx`
```tsx
import { Web3Provider } from '../providers/Web3Provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
```

### React (Vite) — `src/main.tsx`
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Web3Provider } from './providers/Web3Provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
)
```

---

## 7. Pakai di halaman/komponen manapun

```tsx
import { ConnectButton } from '../components/ConnectButton'

export default function HomePage() {
  return (
    <main>
      <h1>My dApp</h1>
      <ConnectButton />
    </main>
  )
}
```

---

## Wallet yang Didukung Otomatis

Modal AppKit sudah mendukung 300+ wallet termasuk:
- ✅ MetaMask (extension & mobile)
- ✅ OKX Wallet
- ✅ QR Code (semua wallet mobile via WalletConnect)
- ✅ Trust Wallet
- ✅ Coinbase Wallet
- ✅ Rainbow, dll.

## Kustomisasi Tampilan Modal (Opsional)

```ts
export const modal = createAppKit({
  // ...config lainnya
  themeMode: 'dark', // atau 'light'
  themeVariables: {
    '--w3m-accent': '#3B82F6',    // warna accent tombol
    '--w3m-border-radius-master': '12px',
  },
})
```

---

## Tambahan: Baca address & kirim transaksi

```tsx
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, parseEther } from 'ethers'

function TransactionExample() {
  const { address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')

  const sendTx = async () => {
    const provider = new BrowserProvider(walletProvider)
    const signer = await provider.getSigner()
    const tx = await signer.sendTransaction({
      to: '0xRECIPIENT_ADDRESS',
      value: parseEther('0.001'),
    })
    console.log('tx hash:', tx.hash)
  }

  return <button onClick={sendTx}>Send 0.001 ETH</button>
}
```

---

## Links
- Docs: https://docs.reown.com/appkit/overview
- Dashboard: https://cloud.reown.com
- Explorer Wallet IDs: https://explorer.walletconnect.com
