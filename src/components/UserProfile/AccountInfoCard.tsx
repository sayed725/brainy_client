import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle2, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

type AccountInfoCardProps = {
  user: any; // adjust type if you have full user shape
  createdAt?: string | Date | number;
};

export default function AccountInfoCard({ user, createdAt }: AccountInfoCardProps) {
  const formatSafe = (dateValue?: string | number | Date) => {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    return isValid(date) ? format(date, "d MMMM yyyy") : "—";
  };

  const handlePassChange = () => {
    toast.success("Feature coming soon!");
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Shield className="h-5 w-5 text-teal-600" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-teal-100 dark:bg-teal-950/70 p-3 rounded-full shrink-0">
            <Calendar className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Member Since</p>
            <p className="font-medium">{formatSafe(createdAt ?? user?.createdAt)}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-4">
          <div className="bg-teal-100 dark:bg-teal-950/70 p-3 rounded-full shrink-0">
            <CheckCircle2 className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account Status</p>
            <p className="font-medium text-green-600 dark:text-green-400">{user?.status}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/40 px-6 py-5">
        <Button
          onClick={handlePassChange}
          variant="outline"
          className="w-full gap-2"
        >
          <Lock className="h-4 w-4" />
          Change Password
        </Button>
      </CardFooter>
    </Card>
  );
}