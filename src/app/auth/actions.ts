'use server';

import { z } from 'zod';
import { createUser, getUserByEmail } from '@/lib/users';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';

// Schema for registration
const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

// Schema for login
const loginSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export async function register(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Já existe uma conta com este email.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await createUser({ name, email, passwordHash });
    
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Ocorreu um erro ao criar a conta.' };
  }

  redirect('/login');
}

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
     return {
      success: false,
      error: "Verifique os campos e tente novamente.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Credenciais inválidas.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return { success: false, error: 'Credenciais inválidas.' };
    }
    
    await createSession(user.id);

  } catch (error) {
    console.error(error);
    return { success: false, error: 'Ocorreu um erro ao fazer login.' };
  }
  
  redirect('/');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}