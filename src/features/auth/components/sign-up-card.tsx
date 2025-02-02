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
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string>("");

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    setPending(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => setError("Something went wrong"))
      .finally(() => setPending(pending));
  };

  const handleProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(pending));
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create an Account</CardTitle>
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
        <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
          <Input
            type="text"
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
          />
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
          <Input
            type="password"
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
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
              handleProviderSignUp("google");
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
              handleProviderSignUp("github");
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
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signIn")}
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
