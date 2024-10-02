import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="  w-full h-auto bg-black text-white py-[8rem] px-[1rem] flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="animate-pulse">
          <Lock className="mx-auto h-12 w-12" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold">Access Denied</h2>
        <p className="mt-2 text-sm">
          Sorry, you don&apos;t have permission to access this page. Please log
          in or contact the administrator if you believe this is an error.
        </p>
        <div className="mt-8 space-y-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <LoginLink className="text-white">Log In</LoginLink>
          </Button>
        </div>
      </div>
      <footer className="mt-8 text-center text-sm">
        © {new Date().getFullYear()} NexMeet All rights reserved.
      </footer>
    </div>
  );
}
