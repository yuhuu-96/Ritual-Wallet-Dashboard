# Ritual Wallet Dashboard

A single-page **Web3 command center** for the **Ritual Testnet**. No backend, no database — all data is fetched directly from the Ritual RPC node in real-time via the browser.

## Features

- 🔗 **Wallet Connect** — MetaMask integration with auto network add for Ritual Testnet
- 💰 **Wallet Info** — Connected address, RITUAL balance, disconnect button
- 📡 **Network Stats** — Live block number, gas price, and network status
- 📜 **Transaction History** — Last 10 txs for your wallet fetched via RPC
- 📤 **Quick Send** — Send RITUAL directly from the dashboard
- 🔍 **Explorer Shortcut** — Direct link to Ritual Explorer

## Network Info

| Property | Value |
|---|---|
| Network Name | Ritual |
| Chain ID | 1979 |
| RPC URL | https://rpc.ritualfoundation.org |
| Currency | RITUAL |
| Explorer | https://explorer.ritualfoundation.org |

## How to Use

1. Open `ritual-wallet-dashboard.html` in your browser
2. Click **Connect Wallet** — MetaMask will prompt to add the Ritual network automatically
3. Your dashboard will populate with live data

## Tech Stack

- Pure HTML + CSS + JavaScript (no frameworks)
- [ethers.js v6](https://docs.ethers.org/v6/) via CDN
- MetaMask as wallet provider & signer

## Project

Built for the [Ritual Network](https://ritual.net/) testnet ecosystem.

---

> *No API keys. No backend. Pure RPC.*
