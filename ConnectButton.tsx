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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontSize: '14px',
          fontFamily: 'monospace',
          background: '#f3f4f6',
          padding: '6px 12px',
          borderRadius: '8px',
        }}>
          {shortAddress}
        </span>
        <button
          onClick={() => disconnect()}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => open()}
      style={{
        padding: '10px 24px',
        fontSize: '15px',
        fontWeight: '500',
        background: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
      }}
    >
      Connect Wallet
    </button>
  )
}
