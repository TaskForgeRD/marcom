import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken");

  if (token) {
    // Sudah login
    redirect("/dashboard");
  }

  // Belum login
  redirect("/login");
}
