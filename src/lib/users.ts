import clientPromise from "./database";
import { Collection, ObjectId } from "mongodb";
import type { User } from "./types";

// Helper to get the users collection
async function getUsersCollection(): Promise<Collection<Omit<User, 'id'>>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("users");
}

// Create a new user
export async function createUser(user: { name: string; email: string; passwordHash: string; }): Promise<void> {
  const collection = await getUsersCollection();
  await collection.insertOne(user);
}

// Get a user by email
export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const collection = await getUsersCollection();
  const userFromDb = await collection.findOne({ email });

  if (!userFromDb) {
    return null;
  }
  
  const { _id, ...rest } = userFromDb;
  return { ...rest, id: _id.toString(), _id: _id } as (User & { passwordHash: string });
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
  const { passwordHash, ...userWithoutPassword } = rest as any;
  return { ...userWithoutPassword, id: _id.toString() };
}

// Set password reset token for a user
export async function setUserPasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    const collection = await getUsersCollection();
    await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { passwordResetToken: token, passwordResetExpires: expires } }
    );
}

// Get a user by password reset token
export async function getUserByPasswordResetToken(token: string): Promise<(User & { passwordHash: string }) | null> {
    const collection = await getUsersCollection();
    const userFromDb = await collection.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
    });

    if (!userFromDb) {
        return null;
    }

    const { _id, ...rest } = userFromDb;
    return { ...rest, id: _id.toString() } as (User & { passwordHash: string });
}

// Update user's password and clear reset token
export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    const collection = await getUsersCollection();
    await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
            $set: { passwordHash: passwordHash },
            $unset: { passwordResetToken: "", passwordResetExpires: "" },
        }
    );
}
