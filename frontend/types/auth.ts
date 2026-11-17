export type Role = "ADMIN" | "USER" | "GUEST";

export interface AuthSession {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: Role;
    first_name: string | null;
    last_name: string | null;
    credits_centavos: number;
    avatar_url: string | null;
  };
}

export interface SignUpPayload {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  confirm_password: string;
}
