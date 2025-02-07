import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => setError("Invalid Email or Password"))
      .finally(() => setPending(false));
  };

  const { signIn } = useAuthActions();
  const handleProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(pending));
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
          <Input
            type="email"
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={pending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => {
              handleProviderSignIn("google");
            }}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
          >
            <FcGoogle className="size-8 absolute left-5" />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => {
              handleProviderSignIn("github");
            }}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
          >
            <FaGithub className="size-8 absolute left-5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
