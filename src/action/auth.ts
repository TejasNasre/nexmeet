"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function userAuth() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  return isUserAuthenticated;
}
