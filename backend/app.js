// import 'dotenv/config';
const express = require("express")
const app = express()
const sanitizeHTML = require("sanitize-html")
const jwt = require("jsonwebtoken")
const cors = require("cors")

// Provide a comma-separated list in ENV, e.g. "https://app.example.com,https://my-frontend.vercel.app"
const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const FRONTEND_URL = process.env.FRONTEND_URL; // single origin convenience

function originIsAllowed(origin) {
  if (!origin) return false; // non-browser requests
  if (allowed.includes(origin)) return true;
  if (origin === FRONTEND_URL) return true;
  // Accept Vercel preview domains (optional, less strict)
  if (origin.endsWith('.vercel.app')) return true;
  return false;
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || originIsAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'), false);
    }
  },
  credentials: true
}));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/", require("./router"))

const server = require("http").createServer(app)
const io = require("socket.io")(server, {
  pingTimeout: 30000,
  cors: true
})

io.on("connection", function(socket) {
  socket.on("chatFromBrowser", function(data) {
    try {
      let user = jwt.verify(data.token, process.env.JWTSECRET)
      socket.broadcast.emit("chatFromServer", { message: sanitizeHTML(data.message, { allowedTags: [], allowedAttributes: {} }), username: user.username, avatar: user.avatar })
    } catch (e) {
      console.log("Not a valid token for chat.")
    }
  })
})

module.exports = server
