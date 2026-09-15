import { redirect } from "next/navigation";
import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import AdminDashboard from "./admin-dashboard";

export const dynamic = "force-dynamic";
const ADMIN_EMAIL = "eenoo2005@gmail.com";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  if (user.email.toLowerCase() !== ADMIN_EMAIL) redirect("/");
  return <AdminDashboard userName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
