export default function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    </div>
  );
}