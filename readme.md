# 🎓 Zonaka

**Zonaka** is a hybrid Web2 + Web3 platform that helps students and parents in Indonesia make fair, transparent school choices — while securing academic records on-chain to prevent tampering, loss, or manipulation.

---

## 🔍 Overview

Every year in Indonesia, school admissions face the same problems:

- 🧾 Lost or fake diplomas (ijazah)
- 📍 Unfair school zoning (zonasi)
- 💰 Corruption in admission (nyogok or "orang dalam")
- 🎓 Job applications still requiring physical diploma proof
- ✍️ Fake ijazah cases remain widespread

**Zonaka** was built to solve these problems using modern technology.  
It combines a friendly Web2 experience with the integrity and security of Web3.

---

## 💡 Key Features

### ✅ What Works
- Users can log in using **Google**
- Users can fill in academic data, edit, and **lock it before submission**
- Data is **submitted to a blockchain canister** and stored securely
- System **automatically runs prediction** after submission
- Prediction results are saved in the chain and **can be viewed instantly**
- Queue system allows **batch submission** to reduce costs
- Parent dashboard lets users **manage multiple students**
- Web3 identity connection is integrated (via Internet Identity)

---

## ⚠️ Limitations & Incomplete Features

- ❌ Reading prediction result on frontend failed — due to canister separation (school/student/predict), we couldn’t link them properly
- ❌ User location input is still hardcoded — no map integration yet
- ❌ Dashboard is only available for parents — school & partner views not built
- ❌ Project is not deployed yet — runs only locally
- ❌ UI still needs major polishing
- ❌ Final prediction view not connected on the frontend

---

## 🧱 Tech Stack

### Web2
- **Next.js** (frontend)
- **Prisma** (ORM)
- **PostgreSQL** (database)
- **NextAuth.js** (Google login)
- Generated using **T3 Stack**

### Web3
- **Motoko** (smart contracts)
- **Canisters** on Internet Computer (IC)

---

## 🧭 Architecture

Zonaka uses a **monorepo structure** with CI/CD for each part:

