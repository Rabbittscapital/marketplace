import { compare } from "bcryptjs";

export async function authorize(email: string, pass: string, prisma: any) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await compare(pass, user.password); // ← corregido aquí
  if (!ok) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role } as any;
}
