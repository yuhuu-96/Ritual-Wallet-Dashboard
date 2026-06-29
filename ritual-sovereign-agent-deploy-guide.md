# 🚀 Ritual Sovereign Agent — Step-by-Step Deploy Guide

> **Chain:** Ritual (ID `1979`) | **RPC:** `https://rpc.ritualfoundation.org` | **Block time:** ~350ms
>
> **Verified:** 2026-06-26 | **Total Cost:** ~0.165 RITUAL

---

## 📋 Daftar Isi

1. [Arsitektur](#arsitektur)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Deploy Step-by-Step](#deploy-step-by-step)
5. [Biaya & Penghematan](#biaya--penghematan)
6. [Monitoring & Verifikasi](#monitoring--verifikasi)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arsitektur

```
┌──────────────┐    deployHarness     ┌──────────────┐
│  Your EOA    │ ──────────────────▶  │   Factory    │ ─── CREATE3 ──▶ Harness
└──────────────┘                      └──────────────┘
       │
       │  configureFundAndStart
       ▼
┌──────────────┐    schedule()        ┌──────────────┐
│   Harness    │ ──────────────────▶  │  Scheduler   │
└──────────────┘                      └──────────────┘
       │                                     │
       │  wakeUp() every 2000 blocks         │
       ▼                                     │
┌──────────────┐    0x080C call        ┌──────────────┐
│  Precompile  │ ──────────────────▶  │  Executor    │ ─── TEE ──▶ AI Model
│   0x080C     │                      │   (TEE)      │
└──────────────┘                      └──────────────┘
       │                                     │
       │  Phase 2 callback (AI result)       │
       ▼                                     │
┌──────────────┐    onSovereignAgentResult   │
│   Harness    │ ◀──────────────────────────┘
└──────────────┘
```

### Sistem Kontrak

| Kontrak | Address | Fungsi |
|---------|---------|--------|
| SovereignAgentFactory | `0x9dC4C054e53bCc4Ce0A0Ff09E890A7a8e817f304` | Deploy harness via CREATE3 |
| TEEServiceRegistry | `0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F` | Discovery executor TEE |
| AsyncJobTracker | `0xC069FFCa0389f44eCA2C626e55491b0ab045AEF5` | Cek job pending |
| RitualWallet | `0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948` | Escrow fee |
| Scheduler | `0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B` | Eksekusi berulang |

### Rolling Window

| Parameter | Nilai | Arti |
|-----------|-------|------|
| `windowNumCalls` | 5 | 5 panggilan per window |
| `frequency` | 2000 | ~11.7 menit antar panggilan |
| `rolloverThresholdBps` | 5000 | Window baru mulai di 50% |

---

## ✅ Prerequisites

### Tools
- Python 3.10+ dengan: `web3`, `eciespy`, `eth-abi`
- Git-bash / WSL di Windows (PowerShell TIDAK jalan)

### Wallet
- EOA Ritual dengan **≥ 0.2 RITUAL**
- Saran: pakai key dedicated, bukan wallet utama

### API Keys (pilih satu)

| Provider | Variable | Model Rekomendasi |
|----------|----------|-------------------|
| **Gemini** ✅ | `GEMINI_API_KEY` | `gemini-2.5-flash` |
| OpenRouter | `OPENROUTER_API_KEY` | `google/gemini-2.5-flash` |
| OpenAI | `OPENAI_API_KEY` | `gpt-4o-mini` |
| Anthropic | `ANTHROPIC_API_KEY` | `claude-sonnet-4-5-20250929` |

### HuggingFace
1. Buka https://huggingface.co/settings/tokens
2. Buat token dengan akses **write**
3. Buat dataset repo (contoh: `0xpamansam/tamasave-agent`)
4. Token format: `hf_...` (token HF yang asli)

---

## ⚙️ Environment Setup

Buat file `.env`:

```bash
# ── Wallet ──
PRIVATE_KEY=0xYourPrivateKeyHere

# ── HuggingFace ──
HF_TOKEN=hf_abc123...
HF_REPO_ID=yourname/agent-data

# ── LLM Provider ──
# Pilihan: openrouter, openai, anthropic, gemini
LLM_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy...

# ── Konfigurasi Agent ──
# SALT harus UNIK per deploy (ganti = address baru)
SALT=unique-salt-here
CLI_TYPE=5
FREQUENCY=2000
WINDOW_NUM_CALLS=5
ROLLOVER_THRESHOLD_BPS=5000

# ── Funding ──
# 0.15 RITUAL = aman untuk ~50 heartbeat
FUND_AMOUNT=0.15

# ── RPC ──
RPC_URL=https://rpc.ritualfoundation.org
```

**⚠️ PENTING:** `.env` TILAH di-ignore di Git. Jangan pernah commit secrets.

### Install Dependencies

```bash
pip install web3 eciespy eth-abi
```

---

## 🚀 Deploy Step-by-Step

### Step 0: Pre-flight Check

```bash
# Cek balance
python3 -c "
from web3 import Web3
from pathlib import Path
w3 = Web3(Web3.HTTPProvider('https://rpc.ritualfoundation.org'))
env = Path('.env').read_text()
prk = [l for l in env.split('\n') if l.startswith('PRIVATE_KEY=')][0].split('=')[1]
acc = w3.eth.account.from_key(prk)
bal = w3.get_balance(acc.address)
print(f'Address: {acc.address}')
print(f'Balance: {w3.from_wei(bal, \"ether\"):.4f} RITUAL')
print(f'Need: ~0.17 RITUAL minimum')
"
```

Output yang diharapkan:
```
Address: 0xYour...
Balance: 0.3200 RITUAL
Need: ~0.17 RITUAL minimum
```

### Step 1: Clone Repo & Install

```bash
git clone https://github.com/frianowzki/ritual-sovereign-agent-guide.git
cd ritual-sovereign-agent-guide
pip install web3 eciespy eth-abi
```

**Tunggu output:**
```
✅ No pending jobs
Predicted harness: 0x...
✅ Harness deployed: 0x... (gas ~2.3M)
✅ Configured + funded! (gas ~3.8M)
============================================================
✅ SOVEREIGN AGENT DEPLOYED + CONFIGURED!
Harness: 0x...
Explorer: https://explorer.ritualfoundation.org/address/0x...
Schedule: every 2000 blocks (~11.7 min)
Window: 5 calls per window
Funding: 0.15 RITUAL
Model: gemini-2.5-flash
============================================================
```

---

## 💰 Biaya & Penghematan

### Rincian Biaya (Verified 2026-06-26)

| Step | Gas | Biaya |
|------|-----|-------|
| deployHarness | 2,319,273 | ~0.0058 RITUAL |
| configureFundAndStart | 3,764,365 | ~0.0094 RITUAL |
| Fund (FUND_AMOUNT) | — | 0.15 RITUAL |
| **Total** | — | **~0.165 RITUAL** |

### Tips Penghematan

1. **FUND_AMOUNT=0.15** = minimum aman (~50 heartbeat)
2. **0.1 RITUAL** = bisa tapi cuma ~20 heartbeat (risiko habis cepat)
3. **Tau berapa banyak yang dibutuhkan:** 1 heartbeat ≈ 0.003 RITUAL gas
4. **Heartbeat per hari (1x/hari):** 1 bulan butuh ~0.09 RITUAL
5. **Jangan over-fund:** sisa balance yang ga kepakai bisa sulit dikonversi

---

## 📡 Monitoring & Verifikasi

### Cek Status On-Chain

```bash
# Cek harness config
python3 -c "
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('https://rpc.ritualfoundation.org'))
addr = '0xYOUR_HARNESS'
code = w3.eth.get_code(addr)
print(f'Contract code: {len(code)} bytes (harusnya ~10822)')

wallet = w3.eth.contract(address='0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948', abi=[{'name':'balanceOf','type':'function','stateMutability':'view','inputs':[{'name':'user','type':'address'}],'outputs':[{'type':'uint256'}]}])
bal = wallet.functions.balanceOf(addr).call()
print(f'RitualWallet: {Web3.from_wei(bal, \"ether\"):.4f} RITUAL')
"
```

### Cek Explorer Cache (setelah ~12 menit)

```bash
python3 -c "
import json, urllib.request
req = urllib.request.Request('https://explorer.ritualfoundation.org/api/agents/cache')
resp = urllib.request.urlopen(req, timeout=15)
data = json.loads(resp.read())
target = '0xYOUR_HARNESS'.lower()
found = [a for a in data.get('sovereign', []) if a.get('address','').lower() == target]
if found:
    print(f'✅ AGENT DI CACHE! lastActivityBlock={found[0].get(\"lastActivityBlock\")}')
else:
    print('⏳ Belum muncul — tunggu ~12 menit lagi')
print(f'Total sovereign agents di cache: {len(data.get(\"sovereign\", []))}')
"
```

### Explorer URLs

| Halaman | URL |
|---------|-----|
| List Agents | `https://explorer.ritualfoundation.org/agents?kind=sovereign` |
| Detail Agent | `https://explorer.ritualfoundation.org/agents/0xHARNESS?type=sovereign` |
| Address Page | `https://explorer.ritualfoundation.org/address/0xHARNESS` |
| Cache API | `https://explorer.ritualfoundation.org/api/agents/cache` |

---

## 🔧 Troubleshooting

### Error: `DeploymentFailed()` (selector `0x30116425`)
**Sebab:** Gas limit deployHarness < 3M
**Fix:** Set gas limit = 3,000,000

### Error: `insufficient funds for gas * price + value`
**Sebab:** Balance tidak cukup untuk fund + gas
**Fix:** Kurangi FUND_AMOUNT ke 0.15, atau isi ulang wallet

### Error: `configureFundAndStart` revert tanpa alasan
**Sebab:** Gas limit terlalu rendah (~3M)
**Fix:** Set gas limit = 5,000,000

### Error: `InvalidDeliveryTarget()`
**Sebab:** deliveryTarget ≠ predicted harness address
**Fix:** Ambil address dari `predictHarness()`, jangan dari factory

### Error: `hasPendingJobForSender` = true
**Sebab:** Ada job pending dari EOA yang sama
**Fix:** Tunggu selesai, atau pakai EOA berbeda

### Agent tidak muncul di explorer setelah 1 jam
**Sebab:** Scheduler belum trigger atau model gagal deliver callback
**Fix:** Cek:
1. `lastActivityBlock > 0` di cache API? Jika ya = sudah trigger
2. Tx di address page muncul? Jika ya = callback delivered
3. Jika tidak: mungkin model ID tidak valid — deploy ulang dengan model berbeda

### Address harness invalid (bukan 20 bytes)
**Sebab:** Salah slice data dari log
**Fix:** Ambil **40 hex char terakhir** dari 64 char data field:
```python
addr = Web3.to_checksum_address('0x' + log['data'][-40:])
```

### Model yang TIDAK deliver callback
- `zai-org/GLM-4.7-FP8` → gagal silent (event log ada, callback tidak datang)
- **Gunakan** `gemini-2.5-flash` dengan `GEMINI_API_KEY` → ter-verified working

### ECIES nonce length error
**Sebab:** Default nonce = 16 byte, harusnya 12 byte
**Fix:** Pastikan script deploy set `ECIES_CONFIG.symmetric_nonce_length = 12`

---

## 📝 Checklist Deploy

- [ ] `.env` terisi lengkap
- [ ] Balance ≥ 0.2 RITUAL
- [ ] Tidak ada pending job
- [ ] `deployHarness` ✅ OK
- [ ] `configureFundAndStart` ✅ OK
- [ ] Harness punya bytecode (~10,822 bytes)
- [ ] `configured() == true`
- [ ] `lastActivityBlock > 0` (heartbeat)
- [ ] Tx muncul di agent page
- [ ] Agent tampil di explorer agents list

---

## 🔄 Top-Up (Jika Balance Habis)

```bash
# Direct deposit dari EOA
cast send 0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948 \
  "deposit(uint256)" 150000000 \
  --value 0.15ether \
  --private-key $PRIVATE_KEY \
  --rpc-url https://rpc.ritualfoundation.org

# Atau reconfigure (stop + reconfigure dengan funding baru)
python3 scripts/reconfigure.py --harness 0xHARNESS --fund 0.15
```

---

## 📚 Referensi

- [Ritual dApp Skills](https://github.com/ritual-foundation/ritual-dapp-skills) — Official skills
- [Ritual Docs](https://docs.ritualfoundation.org) — Chain documentation
- [Ritual Explorer](https://explorer.ritualfoundation.org) — Block explorer
- [Factory Deploy Guide](https://github.com/frianowzki/ritual-sovereign-agent-guide) — Source repo

---

> **Dibuat:** 2026-06-26
> **Verified on:** Windows 10, Python 3.11, Hermes Agent
> **Agent sukses:** `0x2Bd1C9B1C35ED272ddB8b6f32FED12eca02Dd9e1`
