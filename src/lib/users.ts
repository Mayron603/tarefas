
import clientPromise from "./database";
import { Collection, ObjectId } from "mongodb";
import type { User } from "./types";

// Helper to get the users collection
async function getUsersCollection(): Promise<Collection<Omit<User, 'id'>>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Omit<User, 'id'>>("users");
}

// Create a new user
export async function createUser(user: { name: string; email: string; passwordHash: string; }): Promise<void> {
  const collection = await getUsersCollection();
  await collection.insertOne(user);
}

// Get a user by email
export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const collection = await getUsersCollection();
  const user = await collection.findOne({ email });

  if (!user) {
    return null;
  }
  
  const { _id, ...rest } = user;
  return { ...rest, id: _id.toString() } as (User & { passwordHash: string });
}

// Get a user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const collection = await getUsersCollection();
  // Ensure userId is a valid ObjectId before querying
  if (!ObjectId.isValid(userId)) {
      return null;
  }
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return null;
  }

  const { _id, ...rest } = user;
  // Explicitly exclude passwordHash from the returned user object for security
  const { passwordHash, ...userWithoutPassword } = rest;
  return { ...userWithoutPassword, id: _id.toString() };
}
