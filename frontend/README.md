# Live Ops Helpdesk - RapidDispatch Freight and Logistics

A real-time support ticket dashboard that prevents agents from overwriting each other's work. Built for Sprint 19 - Concurrency, WebSockets, and Race Conditions.

## The Problem

When two support agents open the same ticket at the same time, whoever saves last overwrites the other person's changes. This causes lost work and conflicting information sent to customers.

## The Solution

When an agent opens a ticket to edit it, the ticket instantly locks for everyone else in real time using WebSockets. No page refresh needed. If the agent disconnects without saving (closed laptop, lost Wi-Fi), the server automatically detects it and unlocks the ticket for others.

## Tech Stack

Frontend: React, Vite, Tailwind CSS, Socket.io-client
Backend: Node.js, Express, Socket.io, MongoDB (Mongoose)

## Features

- Live ticket dashboard, updates instantly across all connected users
- Real-time ticket locking with agent name shown
- Edit button disabled for everyone except the agent holding the lock
- Automatic unlock if an agent disconnects unexpectedly
- Connection lost banner if WebSocket connection drops

## Setup Instructions

### Backend

cd backend
npm install
npm run dev

Runs on http://localhost:5000

### Frontend

cd frontend
npm install
npm run dev

Runs on http://localhost:5173

## How to Use

1. Start the backend, then the frontend.
2. Open http://localhost:5173 in two browser windows.
3. Enter a different agent name in each window.
4. Click Edit on a ticket in one window and watch it lock instantly in the other.
5. Click Save / Close to release the lock.
6. Close a tab while a ticket is locked to test automatic unlock on disconnect.

## Author

Saurabh Sanwal
