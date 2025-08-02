import clientPromise from "./database";
import { Collection, ObjectId } from "mongodb";
import type { Task, TaskStatus } from "./types";

// Helper function to get the tasks collection
async function getTasksCollection(): Promise<Collection<Omit<Task, 'id'>>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Omit<Task, 'id'>>("tasks");
}

// Get all tasks for a specific user
export async function getTasks(userId: string): Promise<Task[]> {
  if (!ObjectId.isValid(userId)) {
    console.error("Invalid userId format for getTasks");
    return [];
  }
  const collection = await getTasksCollection();
  const tasksFromDb = await collection.find({ userId: userId }).sort({ deadline: 1 }).toArray();
  
  return tasksFromDb.map((task) => {
    const { _id, ...rest } = task;
    return {
      ...rest,
      id: _id.toString(),
      // Ensure userId is also a string
      userId: task.userId?.toString(),
    };
  }) as Task[];
}


// Add a new task for a specific user
export async function addTask(task: Omit<Task, "id" | "status" | "resolution" | "proofImage" | "completionDate">): Promise<void> {
  const collection = await getTasksCollection();
  await collection.insertOne({ ...task, status: 'todo' });
}

// Update a task's status, ensuring it belongs to the user
export async function updateTaskStatus(taskId: string, status: TaskStatus, userId: string): Promise<void> {
    const collection = await getTasksCollection();
    await collection.updateOne(
        { _id: new ObjectId(taskId), userId: userId },
        { $set: { status: status } }
    );
}

// Mark a task as done, ensuring it belongs to the user
export async function completeTask(taskId: string, resolution: string, userId: string, proofImage?: string): Promise<void> {
    const collection = await getTasksCollection();
    await collection.updateOne(
        { _id: new ObjectId(taskId), userId: userId },
        { $set: { status: 'done', resolution: resolution, proofImage: proofImage, completionDate: new Date().toISOString() } }
    );
}

// Delete a task, ensuring it belongs to the user
export async function deleteTask(taskId: string, userId: string): Promise<void> {
    const collection = await getTasksCollection();
    await collection.deleteOne({ _id: new ObjectId(taskId), userId: userId });
}
