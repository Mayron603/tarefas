"use server";

import { z } from 'zod';
import { createUser, getUserByEmail, getUserByPasswordResetToken, setUserPasswordResetToken, updateUserPassword } from '@/lib/users';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';
import crypto from "crypto";

// --- Schemas ---
const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Email inválido.'),
});

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    token: z.string().min(1, 'Token inválido ou expirado.'),
});


// --- Actions ---

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

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const validatedFields = forgotPasswordSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, error: "Email inválido." };
    }
    const { email } = validatedFields.data;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            // To prevent user enumeration, we don't reveal if the user exists.
             return { success: true, message: "Se o email estiver cadastrado, um link de redefinição será enviado." };
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        await setUserPasswordResetToken(user.id, token, expires);

        // In a real app, you'd email this link. For this demo, we return it in the state.
        const resetLink = `/reset-password?token=${token}`;
        return { 
            success: true, 
            message: "Link de redefinição gerado com sucesso. Em um app real, este link seria enviado por e-mail.",
            resetLink,
        };

    } catch (error) {
        console.error(error);
        return { success: false, error: "Ocorreu um erro." };
    }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const validatedFields = resetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.flatten().fieldErrors };
    }

    const { password, token } = validatedFields.data;

    try {
        const user = await getUserByPasswordResetToken(token);
        if (!user) {
            return { success: false, error: "Token inválido ou expirado. Por favor, solicite um novo." };
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await updateUserPassword(user.id, passwordHash);

    } catch (error) {
        console.error(error);
        return { success: false, error: "Ocorreu um erro ao redefinir a senha." };
    }

    redirect("/login");
}
