# AI Usage Log - Prompts.md

This document lists the AI prompts used during development, as required for transparency.

## Prompt 1
Used for: Understanding how to structure the WebSocket locking logic between frontend and backend.

Prompt: How do I lock a ticket using Socket.io so that only one agent can edit it at a time, and broadcast that lock to all other connected clients?

## Prompt 2
Used for: Handling the ghost disconnect case where an agent closes their browser without unlocking a ticket.

Prompt: How do I detect when a socket disconnects in Socket.io and automatically release any locks that socket was holding, using an in-memory Map?

## Prompt 3
Used for: Setting up Tailwind CSS v4 with Vite using the new plugin-based approach instead of the old config file method.

Prompt: How do I set up Tailwind CSS v4 with Vite using @tailwindcss/vite instead of postcss config?

## Prompt 4
Used for: Debugging React Strict Mode causing the socket connection to fire twice during development.

Prompt: Why does my Socket.io connection fire event listeners twice in React, and how do I fix it using useEffect cleanup?

## Notes

AI was used to speed up boilerplate setup and debug specific errors. All logic was reviewed, tested, and understood before submission.
