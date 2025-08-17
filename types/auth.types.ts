import { z } from "zod";

export const UserSchema = z
  .object({
    id: z.union([z.number(), z.string()]).transform((val) => {
      if (typeof val === "string") {
        const numId = parseInt(val, 10);
        return isNaN(numId) ? val : numId;
      }
      return val;
    }),
    email: z.string().email(),
    name: z.string().min(1),
    avatar_url: z.string().url().optional().nullable(),
  })
  .passthrough();

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
  expires_at: z.string().datetime().optional(),
});

export const GoogleCallbackResponseSchema = z
  .object({
    success: z.boolean(),
    token: z.string().optional(),
    user: UserSchema.optional(),
    message: z.string().optional(),
  })
  .passthrough();

export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type GoogleCallbackResponse = z.infer<
  typeof GoogleCallbackResponseSchema
>;

export interface AuthState {
  readonly user: User | null;
  readonly token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  readonly login: (response: AuthResponse) => void;
  readonly logout: () => void;
  readonly setLoading: (loading: boolean) => void;
  readonly verifyToken: () => Promise<boolean>;
  readonly googleLogin: () => Promise<void>;
  readonly googleCallback: (code: string) => Promise<boolean>;
}
