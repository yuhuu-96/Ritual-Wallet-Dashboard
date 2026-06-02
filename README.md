# Ritual Wallet Dashboard

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-gold?style=for-the-badge&logo=github)](https://yuhuu-96.github.io/Ritual-Wallet-Dashboard/)
[![Network](https://img.shields.io/badge/Network-Ritual%20Testnet-purple?style=for-the-badge)](https://ritual.net/)
[![Chain ID](https://img.shields.io/badge/Chain%20ID-1979-blue?style=for-the-badge)]()

> 🌐 **Live App:** [https://yuhuu-96.github.io/Ritual-Wallet-Dashboard/](https://yuhuu-96.github.io/Ritual-Wallet-Dashboard/)

A single-page **Web3 command center** for the **Ritual Testnet**. No backend, no database — all data is fetched directly from the Ritual RPC node in real-time via the browser.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔗 **Wallet Connect** | MetaMask integration with **auto network add** for Ritual Testnet |
| 💰 **Wallet Info** | Connected address, RITUAL balance, one-click copy with custom checkmark animation & disconnect |
| 🌙 **Light/Dark Switcher** | Premium, buttery-smooth **Light/Dark mode switcher** with custom glassmorphic overrides & theme-responsive chart coloring |
| 📡 **Network Stats** | Live block number, gas price, and green **Live dot indicator** synchronized with RPC |
| 🔄 **RPC Switcher & Ping** | Interactive **Custom RPC switcher** with a built-in connection latency speed checker (latency/ping in ms) |
| 🔄 **Activity Refresh** | Visual circular **countdown timer** showing upcoming refreshes |
| 📈 **Block Time Sparkline** | Real-time **pure Canvas sparkline** tracking the last 20 block intervals with bezier curves & glow effects |
| 📉 **Gas Price Sparkline** | Real-time **pure Canvas sparkline** showing the gas price trend over recent updates |
| 📜 **Transaction History** | Last 10 txs for your wallet fetched via RPC (scans last 100 blocks) |
| 💾 **CSV Exporter** | One-click **CSV exporter** to download parsed transaction history as a spreadsheet |
| 📤 **Quick Send** | Send RITUAL directly from the dashboard with MAX amount helper |
| 🔍 **Explorer Shortcut** | Direct link to Ritual Explorer for the connected address |
| 📱 **Mobile Responsive** | Fully optimized **responsive layouts & font scaling** for small and narrow screens |

---

## 🚀 Quick Start

### Option 1 — Use the Live Demo
Click here: [https://yuhuu-96.github.io/Ritual-Wallet-Dashboard/](https://yuhuu-96.github.io/Ritual-Wallet-Dashboard/)

### Option 2 — Run Locally
```bash
git clone https://github.com/yuhuu-96/Ritual-Wallet-Dashboard.git
cd Ritual-Wallet-Dashboard
# Open index.html in your browser
start index.html
```

---

## 🌐 Network Configuration

| Property | Value |
|---|---|
| **Network Name** | Ritual |
| **Chain ID** | 1979 |
| **RPC URL** | https://rpc.ritualfoundation.org |
| **Currency Symbol** | RITUAL |
| **Block Explorer** | https://explorer.ritualfoundation.org |

> MetaMask will be prompted to **add this network automatically** when you click Connect.

---

## 🛠 How It Works

```
User opens page
     ↓
Clicks "Connect Wallet"
     ↓
MetaMask prompts → Add Ritual Network (Chain 1979) if not present
     ↓
Dashboard loads:
  ├── Wallet balance (via RPC)
  ├── Block number + gas price (live polling every 12s)
  ├── Transaction history (scan last 100 blocks)
  └── Explorer link
```

---

## 🏗 Tech Stack

- **Pure HTML + CSS + JavaScript** — zero frameworks, zero dependencies
- **[ethers.js v6](https://docs.ethers.org/v6/)** — loaded via CDN
- **MetaMask** — wallet provider & transaction signer
- **Ritual RPC** — `https://rpc.ritualfoundation.org`

---

## 📁 Files

```
Ritual-Wallet-Dashboard/
├── index.html                  # Main entry (GitHub Pages)
├── ritual-wallet-dashboard.html # Dashboard source
├── README.md
├── .nojekyll                   # GitHub Pages config
└── .gitignore
```

---

## 🔗 Related

- [Ritual Network](https://ritual.net/)
- [Ritual Explorer](https://explorer.ritualfoundation.org)
- [Ritual Testnet RPC](https://rpc.ritualfoundation.org)

---

> *No API keys. No backend. No database. Pure RPC calls.*
