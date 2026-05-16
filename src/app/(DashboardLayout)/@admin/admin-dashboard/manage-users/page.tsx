// app/admin/users/page.tsx
"use client";
 
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useAllUsers, useUpdateUser, useDeleteUser, extractData } from "@/hooks/useUsers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import moment from "moment";
import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { cn } from "@/lib/utils";
import USPagination from "@/components/shared/USPagination";
 
export default function ManageUsers() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  // Filtering and Sorting State (Backend Driven)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
 
  // Details and Confirmation State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
 
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
 
  // Fetch Users with Query Params for Backend QueryBuilder
  const { data: response, isLoading: loading, error: queryError } = useAllUsers({
    searchTerm: debouncedSearch || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    uniqueStatus: statusFilter !== "all" ? (statusFilter === "active") : undefined,
    emailVerified: verifiedFilter !== "all" ? (verifiedFilter === "true") : undefined,
    sortBy,
    sortOrder,
    page,
    limit: 10
  });
 
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
 
  const users = extractData(response);
  const meta = (response as any)?.meta || (response as any)?.data?.meta;
  const error = queryError ? queryError.message || "Failed to load users" : null;
 
  const isFiltered = searchQuery !== "" || roleFilter !== "all" || statusFilter !== "all" || verifiedFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";
 
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
    setPage(1);
  };
 
  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setVerifiedFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };
 
  const handleToggleStatus = async (targetUserId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      await toast.promise(
        updateUserMutation.mutateAsync({ id: targetUserId, userData: { uniqueStatus: newStatus } }),
        {
          loading: "Updating status...",
          success: `User marked as ${newStatus ? "Active" : "Inactive"}`,
          error: (err) => err.message || "Could not update user status",
        }
      );
    } catch (err) {}
  };
 
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await toast.promise(
        deleteUserMutation.mutateAsync(id),
        {
          loading: "Deleting user...",
          success: <b>User successfully deleted!</b>,
          error: (err) => <b>{err.message || "Failed to delete user"}</b>,
        }
      );
    } catch (error) {}
  };
 
  if (!mounted) {
    return null;
  }
 
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full bg-red-50 p-10 rounded-[2.5rem] border border-red-100 shadow-2xl">
          <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-red-900 mb-2">Service Offline</h2>
          <p className="text-red-700/80 font-medium mb-8">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-xl shadow-red-600/20 transition-all active:scale-95"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="pb-10 max-w-screen-2xl mx-auto space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <DashboardPagesHeader
          title="User Directory"
          subtitle="Manage all platform users, roles, and account security"
          icon={Users}
        />
        
        <div className="flex items-center gap-3 bg-[#1cb89e]/5 p-2 rounded-xl border border-[#1cb89e]/10 pr-6">
           <div className="h-10 w-10 rounded-xl bg-[#1cb89e] flex items-center justify-center shadow-lg shadow-[#1cb89e]/20">
              <Users className="w-5 h-5 text-white" />
           </div>
           <div>
              <p className="text-2xl font-black text-[#1cb89e] tabular-nums">{meta?.total || users.length}</p>
           </div>
        </div>
      </div>
 
      {/* Search and Filters */}
      <div className="flex flex-row gap-2 sm:gap-3 items-center">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h- w-4 text-muted-foreground group-focus-within:text-[#1cb89e] transition-colors" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-11 h-10 bg-card border-none shadow-sm rounded-2xl focus-visible:ring-[#1cb89e]/30 text-sm font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Desktop Filter Toolbar */}
          <div className="hidden lg:flex items-center gap-2">
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="h-12 min-w-[130px] bg-card border-none shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest px-6 focus:ring-0 transition-all hover:bg-muted/50">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Roles</SelectItem>
                <SelectItem value="ADMIN" className="text-[10px] font-black uppercase tracking-widest">Admin</SelectItem>
                <SelectItem value="TUTOR" className="text-[10px] font-black uppercase tracking-widest">Tutor</SelectItem>
                <SelectItem value="STUDENT" className="text-[10px] font-black uppercase tracking-widest">Student</SelectItem>
              </SelectContent>
            </Select>
 
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="h-12 min-w-[130px] bg-card border-none shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest px-6 focus:ring-0 transition-all hover:bg-muted/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Status</SelectItem>
                <SelectItem value="active" className="text-[10px] font-black uppercase tracking-widest">Active</SelectItem>
                <SelectItem value="inactive" className="text-[10px] font-black uppercase tracking-widest">Inactive</SelectItem>
              </SelectContent>
            </Select>
 
            <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v); setPage(1); }}>
              <SelectTrigger className="h-12 min-w-[130px] bg-card border-none shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest px-6 focus:ring-0 transition-all hover:bg-muted/50">
                <SelectValue placeholder="Verified" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">Any Verification</SelectItem>
                <SelectItem value="true" className="text-[10px] font-black uppercase tracking-widest">Verified Only</SelectItem>
                <SelectItem value="false" className="text-[10px] font-black uppercase tracking-widest">Unverified Only</SelectItem>
              </SelectContent>
            </Select>
 
            <Button 
              variant="outline" 
              onClick={resetFilters}
              disabled={!isFiltered}
              className="h-10 px-8 rounded-xl bg-card border-none shadow-sm hover:bg-muted font-black text-[10px] uppercase tracking-[0.15em] disabled:opacity-50 transition-all active:scale-95"
            >
              Reset
            </Button>
          </div>
 
          {/* Mobile Advanced Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden h-12 sm:h-14 px-4 sm:px-6 gap-2 bg-card border-none shadow-sm rounded-xl relative font-black text-xs uppercase tracking-widest hover:bg-muted transition-all active:scale-95">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {isFiltered && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#1cb89e] rounded-full border-2 border-card shadow-sm" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col border-none shadow-sm">
              <SheetHeader className="p-8 border-b border-border/50">
                <SheetTitle className="text-2xl font-black flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#1cb89e]/10">
                    <Filter className="w-5 h-5 text-[#1cb89e]" />
                  </div>
                  Directory Filters
                </SheetTitle>
                <SheetDescription className="text-sm font-medium">Filter users by role, status, and verification</SheetDescription>
              </SheetHeader>
              
              <div className="p-8 space-y-10 flex-1 overflow-y-auto custom-scrollbar">
                {/* Role Filter */}
                <div className="space-y-4">
                  <h3 className="font-black text-[10px] text-muted-foreground uppercase tracking-[0.2em]">User Role</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["all", "ADMIN", "TUTOR", "STUDENT"].map((role) => (
                      <Button
                        key={role}
                        variant={roleFilter === role ? "default" : "outline"}
                        onClick={() => { setRoleFilter(role); setPage(1); }}
                        className={cn(
                          "h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border-none transition-all",
                          roleFilter === role ? "bg-[#1cb89e] text-white shadow-sm shadow-[#1cb89e]/20" : "bg-muted/30 hover:bg-muted"
                        )}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
 
                {/* Status Filter */}
                <div className="space-y-4">
                  <h3 className="font-black text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Account Status</h3>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-full h-14 bg-muted/30 border-none rounded-xl font-black text-[10px] uppercase tracking-widest px-6">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-sm p-2">
                      <SelectItem value="all" className="rounded-xl p-3 font-bold">All Status</SelectItem>
                      <SelectItem value="active" className="rounded-xl p-3 font-bold">Active Only</SelectItem>
                      <SelectItem value="inactive" className="rounded-xl p-3 font-bold">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
 
                {/* Verification Filter */}
                <div className="space-y-4">
                  <h3 className="font-black text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Verification</h3>
                  <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-full h-14 bg-muted/30 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest px-6">
                      <SelectValue placeholder="Verified" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-sm p-2">
                      <SelectItem value="all" className="rounded-xl p-3 font-bold text-xs uppercase tracking-widest">Any Verification</SelectItem>
                      <SelectItem value="true" className="rounded-xl p-3 font-bold text-xs uppercase tracking-widest">Verified Only</SelectItem>
                      <SelectItem value="false" className="rounded-xl p-3 font-bold text-xs uppercase tracking-widest">Unverified Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
 
                {/* Sort Logic */}
                <div className="space-y-4">
                  <h3 className="font-black text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Sorting</h3>
                  <div className="space-y-2">
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                      const [by, order] = v.split('-');
                      setSortBy(by);
                      setSortOrder(order as "asc" | "desc");
                      setPage(1);
                    }}>
                      <SelectTrigger className="w-full h-14 bg-muted/30 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest px-6">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-sm p-2">
                        <SelectItem value="createdAt-desc" className="rounded-xl p-3 font-bold">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc" className="rounded-xl p-3 font-bold">Oldest First</SelectItem>
                        <SelectItem value="name-asc" className="rounded-xl p-3 font-bold">Name: A-Z</SelectItem>
                        <SelectItem value="name-desc" className="rounded-xl p-3 font-bold">Name: Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
 
              <div className="p-8 border-t border-border/50 bg-muted/10">
                <Button 
                  onClick={resetFilters} 
                  variant="outline" 
                  disabled={!isFiltered}
                  className="w-full h-14 rounded-xl border-none bg-background shadow-sm hover:bg-red-50 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
 
      {/* Users Table */}
      <div className="rounded-xl border-none shadow-sm overflow-hidden bg-card transition-all duration-500">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-14 font-black text-[10px] uppercase tracking-widest pl-10 text-muted-foreground">#</TableHead>
                <TableHead className="w-20 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Avatar</TableHead>
                <TableHead
                  className="cursor-pointer group hover:text-[#1cb89e] transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                    Full Name <ArrowUpDown className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortBy === "name" && "opacity-100 text-[#1cb89e]")} />
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Permissions</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Account Status</TableHead>
                <TableHead
                  className="cursor-pointer group hover:text-[#1cb89e] transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                    Joined <ArrowUpDown className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortBy === "createdAt" && "opacity-100 text-[#1cb89e]")} />
                  </div>
                </TableHead>
                <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
 
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse border-border/10">
                    <TableCell colSpan={7} className="p-6">
                       <div className="h-14 bg-muted/40 rounded-2xl w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-96 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
                       <div className="p-6 rounded-full bg-muted/20 border-2 border-dashed border-border/50">
                          <Users className="w-12 h-12 text-muted-foreground opacity-20" />
                       </div>
                       <div>
                          <p className="text-lg font-black text-foreground">No Users Found</p>
                          <p className="text-xs font-medium text-muted-foreground">Try adjusting your filters or search query</p>
                       </div>
                       <Button onClick={resetFilters} variant="link" className="text-[#1cb89e] font-black text-xs uppercase tracking-widest">Clear Everything</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: any, index: number) => (
                  <TableRow
                    key={user.id}
                    className="group border-border/30 hover:bg-muted/10 transition-colors"
                  >
                    <TableCell className="pl-10 font-mono text-[10px] text-muted-foreground font-black opacity-40">
                      {((page - 1) * 10 + index + 1).toString().padStart(2, "0")}
                    </TableCell>
 
                    <TableCell>
                      <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-background shadow-md bg-muted group-hover:scale-110 transition-transform duration-500">
                        <img
                          src={
                            user.image ??
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=1cb89e&color=fff&size=128&font-size=0.4&bold=true`
                          }
                          alt={user?.name ?? "user"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
 
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-foreground">{user.name || "—"}</span>
                        <span className="text-[10px] font-bold text-muted-foreground lowercase opacity-60 tracking-tight">{user.email}</span>
                      </div>
                    </TableCell>
 
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-xl font-bold text-[10px] uppercase tracking-[0.05em] px-3 py-1 border shadow-none transition-colors",
                          user.role === "ADMIN" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                          user.role === "TUTOR" && "bg-purple-50 text-purple-600 border-purple-100",
                          user.role === "STUDENT" && "bg-blue-50 text-blue-600 border-blue-100"
                        )}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
 
                    <TableCell>
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                             <div className={cn("w-2 h-2 rounded-full", user.uniqueStatus ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-gray-300")} />
                             <span className="font-black text-[10px] uppercase tracking-widest text-foreground">{user.uniqueStatus ? "Active" : "Disabled"}</span>
                          </div>
                       </div>
                    </TableCell>
 
                    <TableCell className="text-muted-foreground text-xs font-bold uppercase tracking-tighter tabular-nums opacity-60">
                      {moment(user.createdAt).format("DD MMM, YYYY")}
                    </TableCell>
 
                    <TableCell className="text-right pr-10">
                      <div className="flex items-center justify-end gap-2 transition-all duration-300">
                        {user.role === "STUDENT" && (
                           <Switch
                             checked={user.uniqueStatus ?? false}
                             onCheckedChange={() =>
                               handleToggleStatus(
                                 user.id,
                                 user.uniqueStatus ?? false,
                               )
                             }
                             className="data-[state=checked]:bg-[#1cb89e] scale-90"
                           />
                        )}
 
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-2xl hover:bg-muted text-muted-foreground hover:scale-110 active:scale-95 transition-all"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDetailsOpen(true);
                              }}
                              className="rounded-xl font-black text-xs uppercase tracking-widest p-4 cursor-pointer focus:bg-[#1cb89e]/10 focus:text-[#1cb89e]"
                            >
                              <Eye className="mr-3 h-4 w-4" />
                              Inspect Account
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditingPermissions(true);
                              }}
                              className="rounded-xl font-black text-xs uppercase tracking-widest p-4 cursor-pointer focus:bg-blue-500/10 focus:text-blue-500"
                            >
                              <Edit className="mr-3 h-4 w-4" />
                              Modify Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteOpen(true);
                              }}
                              disabled={user.role === "ADMIN"}
                              className="rounded-xl font-black text-xs uppercase tracking-widest p-4 cursor-pointer text-rose-600 focus:bg-rose-600 focus:text-white"
                            >
                              <Trash2 className="mr-3 h-4 w-4" />
                              Terminate User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
 
        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="bg-muted/5 border-t border-border/30">
            <USPagination
              page={page}
              totalPage={meta?.totalPage || 1}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
 
      {/* Modals */}
      <UserDetailDialog
        user={selectedUser}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      
      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        loading={deleteUserMutation.isPending}
        onConfirm={async () => {
          if (!selectedUser) return;
          try {
            await toast.promise(
              deleteUserMutation.mutateAsync(selectedUser.id),
              {
                loading: "Terminating account...",
                success: <b>Account successfully removed.</b>,
                error: (err) => <b>{err.message || "Failed to terminate user"}</b>,
              }
            );
            setIsDeleteOpen(false);
            setSelectedUser(null);
          } catch (err) {}
        }}
      />
    </div>
  );
}
 
function UserDetailDialog({ user, open, onOpenChange }: { user: any; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!user) return null;
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md rounded-xl border border-border/50 shadow-md p-0 overflow-hidden bg-card">
        <DialogHeader className="sr-only">
          <DialogTitle>User Profile: {user.name}</DialogTitle>
          <DialogDescription>Detailed account information and verification status for {user.name}</DialogDescription>
        </DialogHeader>
        <div className="h-32 bg-gradient-to-br from-[#1cb89e] to-[#128c78] relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>
        
        <div className="px-4 sm:px-8 pb-8 sm:pb-10 -mt-12 sm:-mt-16 relative z-10">
           <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl overflow-hidden border-4 sm:border-8 border-card shadow-xl bg-muted mb-4 sm:mb-6">
                <img
                  src={user.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=1cb89e&color=fff&size=256&font-size=0.4&bold=true`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <h2 className="text-xl font-black text-foreground mb-1">{user.name || "Unnamed User"}</h2>
              <p className="text-xs font-bold text-muted-foreground mb-6 opacity-60 tracking-tight">{user.email}</p>
              
              <div className="flex gap-2 mb-10">
                <Badge variant="outline" className={cn(
                  "rounded-xl font-bold text-[10px] uppercase tracking-[0.05em] px-3 py-1 border transition-colors",
                  user.role === "ADMIN" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                  user.role === "TUTOR" && "bg-purple-50 text-purple-600 border-purple-100",
                  user.role === "STUDENT" && "bg-blue-50 text-blue-600 border-blue-100"
                )}>
                  {user.role}
                </Badge>
                <Badge variant="outline" className={cn(
                  "rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-2 border-none shadow-sm",
                  user.uniqueStatus ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                )}>
                  {user.uniqueStatus ? "Active Account" : "Suspended"}
                </Badge>
              </div>
              
              <div className="w-full space-y-3">
                 <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-[#1cb89e]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Status</span>
                    </div>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", user.emailVerified ? "text-green-600" : "text-amber-600")}>
                       {user.emailVerified ? "Verified" : "Pending"}
                    </span>
                 </div>
                 
                 <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Users className="w-5 h-5 text-[#1cb89e]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registration Date</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                       {moment(user.createdAt).format("MMM DD, YYYY")}
                    </span>
                 </div>
                 
                 <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="w-5 h-5 text-[#1cb89e]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">User ID</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-40 font-mono">
                       #{user.id.slice(-6)}
                    </span>
                 </div>
              </div>
           </div>
        </div>
        
        <DialogFooter className="p-4 bg-muted/10 border-t border-border/50">
           <Button onClick={() => onOpenChange(false)} className="w-full h-10 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#1cb89e]/10 transition-all active:scale-95">
              Close Profile
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
 
function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, loading }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void; loading: boolean }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md rounded-xl border border-border/50 shadow-sm p-5 sm:p-8 bg-card text-center">
        <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
          <Trash2 className="w-8 h-8" />
        </div>
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-black text-foreground">Terminate User?</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium text-sm">
            This action is permanent. All associated data will be removed from the platform. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8 flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/50 bg-muted/30 hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm transition-all active:scale-95"
          >
            {loading ? "Deleting..." : "Confirm Termination"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
