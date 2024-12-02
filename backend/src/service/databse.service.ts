import { MongoClient, ServerApiVersion } from 'mongodb';

export class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient;
  
  private constructor() {
    const uri = process.env.MONGODB_URI || "mongodb+srv://aaronamato93:<db_password>@todo-app.xirx2.mongodb.net/?retryWrites=true&w=majority&appName=todo-app";
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Successfully connected to MongoDB!");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  getDb() {
    return this.client.db("todo-app");
  }

  async close() {
    await this.client.close();
  }
}