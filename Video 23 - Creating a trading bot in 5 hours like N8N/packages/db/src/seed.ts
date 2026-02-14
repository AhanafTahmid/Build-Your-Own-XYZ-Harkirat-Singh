import {
  connectDB,
  disconnectDB,
  UserModel,
  NodeModel,
  WorkflowModel,
  ExecutionModel,
} from "./index";

/**
 * Seed script to populate the database with sample data
 * Run with: bun run src/seed.ts
 */

async function seed() {
  try {
    const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/trading-n8n";
    await connectDB(mongoUrl);

    console.log("🌱 Seeding database...");

    // Clear existing data
    await UserModel.deleteMany({});
    await NodeModel.deleteMany({});
    await WorkflowModel.deleteMany({});
    await ExecutionModel.deleteMany({});

    // Create a test user
    const user = await UserModel.create({
      username: "trader",
      password: "$2a$10$YourHashedPasswordHere", // In real app, use bcrypt
    });
    console.log("✅ Created user:", user.username);

    // Create node templates
    const timerNode = await NodeModel.create({
      title: "Timer",
      description: "Triggers workflow at regular intervals",
      type: "TRIGGER",
      credentialsType: [
        {
          title: "Interval",
          type: "string",
          required: true,
        },
      ],
    });

    const tradeNode = await NodeModel.create({
      title: "Trade",
      description: "Execute a trade on the exchange",
      type: "ACTION",
      credentialsType: [
        {
          title: "API Key",
          type: "string",
          required: true,
        },
        {
          title: "API Secret",
          type: "password",
          required: true,
        },
      ],
    });

    const emailNode = await NodeModel.create({
      title: "Email",
      description: "Send email notification",
      type: "ACTION",
      credentialsType: [
        {
          title: "SMTP Host",
          type: "string",
          required: true,
        },
        {
          title: "SMTP Port",
          type: "number",
          required: true,
        },
      ],
    });

    console.log("✅ Created node templates");

    // Create sample workflows
    const workflow1 = await WorkflowModel.create({
      userId: user._id,
      name: "SOL Trading Bot",
      nodes: [
        {
          type: timerNode._id,
          data: {
            kind: "TRIGGER",
            metadata: { interval: "60 seconds" },
          },
          id: "timer-1",
          position: { x: 200, y: 300 },
        },
        {
          type: tradeNode._id,
          data: {
            kind: "ACTION",
            metadata: {
              type: "LONG",
              quantity: 0.01,
              symbol: "SOL",
            },
          },
          id: "trade-1",
          position: { x: 600, y: 200 },
          credentials: {
            apiKey: "your-api-key",
            apiSecret: "your-api-secret",
          },
        },
      ],
      edges: [
        {
          id: "edge-1",
          source: "timer-1",
          target: "trade-1",
        },
      ],
      isActive: true,
    });

    const workflow2 = await WorkflowModel.create({
      userId: user._id,
      name: "ETH Alert System",
      nodes: [
        {
          type: timerNode._id,
          data: {
            kind: "TRIGGER",
            metadata: { interval: "30 seconds" },
          },
          id: "timer-2",
          position: { x: 150, y: 250 },
        },
        {
          type: emailNode._id,
          data: {
            kind: "ACTION",
            metadata: {
              subject: "ETH Price Alert",
              to: "trader@example.com",
            },
          },
          id: "email-1",
          position: { x: 550, y: 250 },
        },
      ],
      edges: [
        {
          id: "edge-2",
          source: "timer-2",
          target: "email-1",
        },
      ],
      isActive: false,
    });

    console.log("✅ Created workflows");

    // Create sample executions
    await ExecutionModel.create({
      workflowId: workflow1._id,
      status: "SUCCESS",
      startTime: new Date("2024-02-14T10:30:00"),
      endTime: new Date("2024-02-14T10:30:02.3"),
      mode: "automatic",
      logs: [
        {
          nodeId: "timer-1",
          message: "Timer triggered",
          timestamp: new Date("2024-02-14T10:30:00"),
          level: "info",
        },
        {
          nodeId: "trade-1",
          message: "Trade executed successfully",
          timestamp: new Date("2024-02-14T10:30:02"),
          level: "info",
        },
      ],
    });

    await ExecutionModel.create({
      workflowId: workflow1._id,
      status: "ERROR",
      startTime: new Date("2024-02-14T10:28:00"),
      endTime: new Date("2024-02-14T10:28:00.5"),
      mode: "automatic",
      error: "Insufficient funds",
      logs: [
        {
          nodeId: "timer-1",
          message: "Timer triggered",
          timestamp: new Date("2024-02-14T10:28:00"),
          level: "info",
        },
        {
          nodeId: "trade-1",
          message: "Trade failed: Insufficient funds",
          timestamp: new Date("2024-02-14T10:28:00.5"),
          level: "error",
        },
      ],
    });

    console.log("✅ Created executions");

    console.log("\n🎉 Database seeded successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`- Users: ${await UserModel.countDocuments()}`);
    console.log(`- Node Templates: ${await NodeModel.countDocuments()}`);
    console.log(`- Workflows: ${await WorkflowModel.countDocuments()}`);
    console.log(`- Executions: ${await ExecutionModel.countDocuments()}`);

    await disconnectDB();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
