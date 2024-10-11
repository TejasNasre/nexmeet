'use server'
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
export async function userDetails() {
const {getUser} = getKindeServerSession();
const user = await getUser();
console.log("Fetched User:", user);
console.log("Fetched user details:", user); 
 // Log the fetched user details
return user;
}