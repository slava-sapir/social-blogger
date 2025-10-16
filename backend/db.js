const dotenv = require("dotenv")
dotenv.config()
const { MongoClient } = require("mongodb")
                                          
const client = new MongoClient(process.env.CONNECTIONSTRING)
module.exports = client
async function start() {
  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")
    const app = require("./app")
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
    })
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err)
  }
}

start()
