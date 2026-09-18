import { useEffect, useState } from 'react';
import socket from './socket';

function App() {
  const [tickets, setTickets] = useState([]);
  const [locks, setLocks] = useState({});
  const [agentName, setAgentName] = useState('');
  const [nameEntered, setNameEntered] = useState(false);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    fetch('https://liveops-backend-xn38.onrender.com/api/tickets')
      .then((res) => res.json())
      .then((data) => setTickets(data));

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join_dashboard');
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('current_locks', (currentLocks) => {
      const lockMap = {};
      currentLocks.forEach((l) => {
        lockMap[l.ticketId] = l.agentName;
      });
      setLocks(lockMap);
    });

    socket.on('new_ticket', (ticket) => {
      setTickets((prev) => [ticket, ...prev]);
    });

    socket.on('ticket_locked', ({ ticketId, agentName }) => {
      setLocks((prev) => ({ ...prev, [ticketId]: agentName }));
    });

    socket.on('ticket_unlocked', ({ ticketId }) => {
      setLocks((prev) => {
        const updated = { ...prev };
        delete updated[ticketId];
        return updated;
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('current_locks');
      socket.off('new_ticket');
      socket.off('ticket_locked');
      socket.off('ticket_unlocked');
    };
  }, []);

  const handleLock = (ticketId) => {
    socket.emit('lock_ticket', { ticketId, agentName });
  };

  const handleUnlock = (ticketId) => {
    socket.emit('unlock_ticket', { ticketId });
  };

  if (!nameEntered) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-zinc-900 p-8 rounded-xl border border-green-800 w-80">
          <h1 className="text-green-500 text-xl font-bold mb-4">Enter Your Name</h1>
          <input
            className="w-full p-2 rounded bg-black border border-green-700 text-white mb-4 outline-none"
            placeholder="Agent name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
          <button
            className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded transition"
            onClick={() => agentName.trim() && setNameEntered(true)}
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {!connected && (
        <div className="bg-red-700 text-white text-center py-2 rounded mb-4">
          Connection Lost: Reconnecting...
        </div>
      )}

      <h1 className="text-3xl font-bold text-green-500 mb-1">Live Ops Helpdesk</h1>
      <p className="text-zinc-400 mb-6">Logged in as: {agentName}</p>

      <div className="grid gap-4">
        {tickets.map((ticket) => {
          const lockedBy = locks[ticket._id];
          const isLockedByMe = lockedBy === agentName;
          const isLockedByOther = lockedBy && lockedBy !== agentName;

          return (
            <div
              key={ticket._id}
              className={`p-4 rounded-lg border transition ${
                isLockedByOther
                  ? 'bg-zinc-800 border-zinc-700'
                  : 'bg-zinc-900 border-green-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{ticket.title}</h2>
                  <p className="text-zinc-400 text-sm">{ticket.customer}</p>
                  <p className="text-zinc-500 text-sm mt-1">{ticket.description}</p>
                </div>

                <div className="text-right">
                  {lockedBy && (
                    <p className="text-yellow-500 text-sm mb-2">🔒 Locked by {lockedBy}</p>
                  )}

                  {!lockedBy && (
                    <button
                      onClick={() => handleLock(ticket._id)}
                      className="bg-green-700 hover:bg-green-600 px-4 py-1 rounded text-sm transition"
                    >
                      Edit
                    </button>
                  )}

                  {isLockedByMe && (
                    <button
                      onClick={() => handleUnlock(ticket._id)}
                      className="bg-red-700 hover:bg-red-600 px-4 py-1 rounded text-sm mt-2 block transition"
                    >
                      Save / Close
                    </button>
                  )}

                  {isLockedByOther && (
                    <button
                      disabled
                      className="bg-zinc-700 px-4 py-1 rounded text-sm cursor-not-allowed"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
