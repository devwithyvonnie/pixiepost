# 📨 Travel Agent Email Automation Tool

A lightweight automation tool for travel agents to automatically send timely, personalized emails to guests before and after their trips — directly from the agent’s own Gmail or Yahoo Mail account.

---

## ✨ Features

- 📅 Schedule and send pre- and post-trip emails automatically
- 📧 Emails sent from the agent's own Gmail or Yahoo account (not a third-party address)
- 👥 Manage guests and trip details easily
- ✍️ Customizable email templates
- 📊 Agent dashboard with analytics:
  - Total guests booked
  - Top destinations
  - Upcoming trips overview

---

## 🚧 MVP Scope

The initial version supports:
- Gmail integration via OAuth 2.0
- Yahoo Mail integration via SMTP + App Passwords
- Basic guest and trip management
- Email scheduling based on trip dates
- Basic analytics dashboard

---

## 🖥️ Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (MongoDB Atlas)
- **Email Providers:** Gmail API, Yahoo SMTP
- **Hosting:** Vercel (frontend), Render/Fly.io (backend)

---

## ⚡ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/travel-agent-email-automation.git
cd travel-agent-email-automation
