import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function NotSignedInState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-muted/60 p-8">
        <User className="h-16 w-16 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">You're not signed in</h2>
        <p className="text-muted-foreground max-w-md">
          Sign in to view and update your profile, manage your account, and access all features.
        </p>
      </div>
      <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
        <a href="/sign-in">Sign In</a>
      </Button>
    </div>
  );
}