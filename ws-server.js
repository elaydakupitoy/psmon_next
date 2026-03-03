// require("dotenv").config({ path: ".env.local" });

// const WebSocket = require("ws");
// const sql = require("mssql");
// const url = require("url");

// const PORT = process.env.WS_PORT || 8080;

// // MSSQL connection config
// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };

// let pool = null;

// // Connect to MSSQL
// async function getConnection() {
//   try {
//     if (pool) return pool;
//     pool = await sql.connect(config);
//     console.log("Connected to MSSQL for WS");
//     return pool;
//   } catch (err) {
//     console.error("WS DB connection error:", err);
//     throw err;
//   }
// }

// // Map to store clients by station
// const clientsByStation = new Map();

// const wss = new WebSocket.Server({ port: PORT }, () => {
//   console.log(`WebSocket server listening on ws://localhost:${PORT}`);
// });

// // Fetch latest station data
// async function fetchStationData(stationId) {
//   try {
//     const pool = await getConnection();

//     const result = await pool.request().input("stationId", sql.VarChar, stationId).query(`
//         SELECT TOP 1
//           st.ps_desc as StationName,
//           ISNULL(lt.value1, 0) as [percent],
//           ISNULL(lt.value2, 0) as volume,
//           ISNULL([timextamp], GETDATE()) as timextamp
//         FROM [psmon].[dbo].[logtable] lt
//         LEFT JOIN dbo.stations st ON st.ps_id = lt.ps_id
//         WHERE st.ps_desc = @stationId
//         ORDER BY [timextamp] DESC
//       `);

//     const data = result.recordset[0] || {};
//     return normalizeData(data, stationId);
//   } catch (err) {
//     console.error(`Error fetching data for ${stationId}:`, err);
//     return normalizeData({}, stationId);
//   }
// }

// // Ensure all fields exist and provide defaults
// function normalizeData(data, stationId) {
//   return {
//     stationName: data.StationName || stationId || "Unknown",
//     percent: Number(data.percent ?? 0),
//     volume: Number(data.volume ?? 0),
//     timestamp: data.timextamp ? new Date(data.timextamp).toISOString() : new Date().toISOString(),
//   };
// }

// // Broadcast data to all clients of a station
// async function broadcastToStation(stationId) {
//   const clients = clientsByStation.get(stationId) || [];
//   if (clients.length === 0) return;

//   const data = await fetchStationData(stationId);
//   const payload = JSON.stringify(data);

//   clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(payload);
//     }
//   });
// }

// // Handle new WebSocket connections
// wss.on("connection", (ws, req) => {
//   const urlPath = url.parse(req.url || "/").pathname;
//   const stationId = urlPath.replace(/^\//, "") || "default";

//   console.log(`Client connected to station: ${stationId}`);

//   if (!clientsByStation.has(stationId)) {
//     clientsByStation.set(stationId, []);
//   }
//   clientsByStation.get(stationId).push(ws);

//   // Send initial data immediately
//   fetchStationData(stationId).then((data) => {
//     if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
//   });

//   ws.on("message", (msg) => {
//     console.log(`Received from ${stationId}:`, msg.toString());
//   });

//   ws.on("close", () => {
//     console.log(`Client disconnected from ${stationId}`);
//     const clients = clientsByStation.get(stationId) || [];
//     const idx = clients.indexOf(ws);
//     if (idx > -1) clients.splice(idx, 1);
//   });
// });

// // Broadcast station-specific data every second
// const iv = setInterval(async () => {
//   for (const stationId of clientsByStation.keys()) {
//     await broadcastToStation(stationId);
//   }
// }, 1000);

// // Graceful shutdown
// process.on("SIGINT", () => {
//   console.log("Shutting down WS server");
//   clearInterval(iv);
//   if (pool) pool.close();
//   wss.close(() => process.exit(0));
// });

// module.exports = wss;

require("dotenv").config({ path: ".env.local" });

const WebSocket = require("ws");
const sql = require("mssql");
const url = require("url");

const PORT = process.env.WS_PORT || 8080;

// MSSQL connection config
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool = null;

// Connect to MSSQL
async function getConnection() {
  try {
    if (pool) return pool;
    pool = await sql.connect(config);
    console.log("Connected to MSSQL for WS");
    return pool;
  } catch (err) {
    console.error("WS DB connection error:", err);
    throw err;
  }
}

// Map to store clients by station
const clientsByStation = new Map();

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});

// Fetch latest station data
async function fetchStationData(stationId) {
  try {
    const pool = await getConnection();
    const result = await pool.request().input("stationId", sql.VarChar, stationId).query(`
        SELECT TOP 1
          st.ps_desc as StationName,
          ISNULL(lt.value1, 0) as [percent],
          ISNULL(lt.value2, 0) as volume,
          ISNULL([timextamp], GETDATE()) as timextamp
        FROM [psmon].[dbo].[logtable] lt
        LEFT JOIN dbo.stations st ON st.ps_id = lt.ps_id
        WHERE st.ps_desc = @stationId
        ORDER BY [timextamp] DESC
      `);

    const data = result.recordset[0] || {};
    return normalizeData(data, stationId);
  } catch (err) {
    console.error(`Error fetching data for ${stationId}:`, err);
    return normalizeData({}, stationId);
  }
}

// Normalize data
function normalizeData(data, stationId) {
  return {
    stationName: data.StationName || stationId || "Unknown",
    percent: Number(data.percent ?? 0),
    volume: Number(data.volume ?? 0),
    timestamp: data.timextamp ? new Date(data.timextamp).toISOString() : new Date().toISOString(),
  };
}

// Broadcast data to all clients of a station
async function broadcastToStation(stationId) {
  const clients = clientsByStation.get(stationId) || [];
  if (clients.length === 0) return;

  const data = await fetchStationData(stationId);
  const payload = JSON.stringify(data);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Handle new WebSocket connections
wss.on("connection", (ws, req) => {
  const urlPath = url.parse(req.url || "/").pathname;
  const stationId = urlPath.replace(/^\//, "");

  if (!stationId) {
    ws.close(1008, "Invalid station path"); // Reject bad paths
    return;
  }

  console.log(`Client connected to station: ${stationId}`);

  if (!clientsByStation.has(stationId)) {
    clientsByStation.set(stationId, []);
  }
  clientsByStation.get(stationId).push(ws);

  // Send initial data immediately
  (async () => {
    try {
      const data = await fetchStationData(stationId);
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
    } catch (err) {
      console.error("Failed to send initial data:", err);
      if (ws.readyState === WebSocket.OPEN) ws.close(1011, "Internal server error");
    }
  })();

  ws.on("message", (msg) => {
    console.log(`Received from ${stationId}:`, msg.toString());
  });

  ws.on("close", (code, reason) => {
    console.log(`Client disconnected from ${stationId}, code: ${code}, reason: ${reason}`);
    const clients = clientsByStation.get(stationId) || [];
    const idx = clients.indexOf(ws);
    if (idx > -1) clients.splice(idx, 1);
  });

  ws.on("error", (err) => {
    console.error(`WebSocket error on ${stationId}:`, err);
  });
});

// Broadcast station-specific data every second
const iv = setInterval(async () => {
  for (const stationId of clientsByStation.keys()) {
    await broadcastToStation(stationId);
  }
}, 1000);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down WS server");
  clearInterval(iv);
  if (pool) pool.close();
  wss.close(() => process.exit(0));
});

module.exports = wss;
