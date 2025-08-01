import clientPromise from "./database";
import { Collection, ObjectId } from "mongodb";
import type { Task } from "./types";

// Helper function to get the tasks collection
async function getTasksCollection(): Promise<Collection<Omit<Task, 'id'>>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Omit<Task, 'id'>>("tasks");
}

// Get all tasks
export async function getTasks(): Promise<Task[]> {
  const collection = await getTasksCollection();
  const tasks = await collection.find({}).toArray();
  // Map MongoDB _id to string id
  return tasks.map((task) => ({ ...task, id: task._id.toString() }));
}

// Add a new task
export async function addTask(task: Omit<Task, "_id" | "id">): Promise<void> {
  const collection = await getTasksCollection();
  await collection.insertOne({ ...task, _id: new ObjectId() });
}

// Update a task's status
export async function updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const collection = await getTasksCollection();
    await collection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { status: status } }
    );
}

// You can add more functions here for updating or deleting tasks
