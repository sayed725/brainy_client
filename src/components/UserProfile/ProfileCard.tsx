import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard, Mail, Phone, Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type ProfileCardProps = {
  user: NonNullable<ReturnType<typeof authClient.useSession>["data"]>["user"];
};

export default function ProfileCard({ user }: ProfileCardProps) {
  const userInitial =
    user.name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <Card className="border shadow-sm overflow-hidden">
      <div className="h-28 bg-linear-to-r from-teal-600 to-teal-800" />
      <CardContent className="pt-0 relative pb-8">
        <div className="flex flex-col items-center -mt-20">
          <div className="relative group">
            <Avatar className="w-28 h-28 border-4 border-background shadow-2xl">
              <AvatarImage
                src={user.image || "https://i.ibb.co/4RS0VXvL/default-user-image.png"}
                alt={user.name || "User"}
              />
              <AvatarFallback className="text-4xl bg-teal-700 text-white font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>

            {/* <Button
              variant="ghost"
              size="icon"
              className="absolute -bottom-2 -right-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
              title="Upload profile picture (coming soon)"
            >
              <Upload className="h-4 w-4" />
            </Button> */}
          </div>

          <div className="mt-5 text-center space-y-1">
            <h2 className="text-xl font-bold">{user.name || "User"}</h2>
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/80 dark:text-teal-300">
              Student
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-5 border-t bg-muted/40 px-6 py-6">
        <div className="flex items-center gap-3 w-full text-sm">
          <IdCard className="h-4 w-4 text-teal-600 shrink-0" />
          <span className="font-mono text-muted-foreground truncate">{user.id}</span>
        </div>
        <div className="flex items-center gap-3 w-full text-sm">
          <Mail className="h-4 w-4 text-teal-600 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 w-full text-sm">
          <Phone className="h-4 w-4 text-teal-600 shrink-0" />
          <span>Not available</span>
        </div>
      </CardFooter>
    </Card>
  );
}