
const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://asd123753951:XVjAIyz5SKKdS4ku@ithelp.eb4bso5.mongodb.net/?retryWrites=true&w=majority&appName=ItHelp";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient('mongodb+srv://asd123753951:XVjAIyz5SKKdS4ku@ithelp.eb4bso5.mongodb.net/?retryWrites=true&w=majority&appName=ItHelp', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
