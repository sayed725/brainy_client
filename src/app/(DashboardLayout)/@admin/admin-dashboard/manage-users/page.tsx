// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getAllUsers, updateUser } from "@/actions/user.action";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import moment from "moment";
import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";

export default function ManageUsers() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const userId = session?.user?.id;

  const refreshUsers = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getAllUsers();
      if (result.error) {
        throw new Error(result.error || "Failed to load users");
      }
      const userList = result.data?.data || [];
      setUsers(userList);
      setFilteredUsers(userList);
      setCurrentPage(1);
    } catch (err: any) {
      const message = err.message || "Failed to load users";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshUsers();
    }
  }, [userId]);

  // Search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }

    const lowerSearch = search.toLowerCase();
    const filtered = users.filter((user) =>
      [
        user.name,
        user.email,
        user.role,
        user.uniqueStatus ? "active" : "inactive",
      ].some((val) => val?.toLowerCase().includes(lowerSearch)),
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [search, users]);

  // Sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "createdAt" || key === "updatedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Special case for uniqueStatus (boolean → treat as 0/1)
      if (key === "uniqueStatus") {
        aValue = a.uniqueStatus ? 1 : 0;
        bValue = b.uniqueStatus ? 1 : 0;
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sorted);
    setCurrentPage(1);
  };

 const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
  const newStatus = !currentStatus;

  // Optimistic update
  const updateLocal = (status: boolean) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, uniqueStatus: status } : u)));
    setFilteredUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, uniqueStatus: status } : u)));
  };

  updateLocal(newStatus);

  try {
    await toast.promise(
      updateUser(userId, { uniqueStatus: newStatus }),
      {
        loading: "Updating status...",
        success: `User marked as ${newStatus ? "Active" : "Inactive"}`,
        error: (err) => err.message || "Could not update user status",
      }
    );

    // Keep data fresh (especially useful if other fields might change)
    await refreshUsers();
  } catch {
    // Revert on failure
    updateLocal(currentStatus);
  }
};

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Placeholder actions
  const handleView = (id: string) => toast.info(`Viewing user: ${id}`);
  const handleEdit = (id: string) => toast.info(`Editing user: ${id}`);


   const handleDelete = async (bookingId: string) => {
        //  try {
        //    await toast.promise(
        //      deleteBooking(bookingId),
        //      {
        //        loading: "Deleting booking...",
        //        success: <b>Booking successfully deleted!</b>,
        //        error: (err) => <b>{err.message || "Failed to delete booking"}</b>,
        //      }
        //    );
           
        //    await refreshBookings();
        //  } catch (error) {
         
        //    await refreshBookings(); 
        //  }
       };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-medium mb-2">Error</p>
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-0 lg:px-6 pb-16">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <DashboardPagesHeader
            title="Manage All Users"
            subtitle="View and manage all registered users(Click on the Titles to Apply Sort/Filter)"
            icon={Users}
          />

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1cb89e]/10 rounded-full">
            <span className="text-[#1cb89e] font-medium">
              {filteredUsers.length}
            </span>
            <span className="text-muted-foreground">Total Users</span>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by name, email, role or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-14">#</TableHead>
                <TableHead className="text-xs">Image</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-1">
                    Email <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Role <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("uniqueStatus")}
                >
                  <div className="flex items-center gap-1">
                    Status <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Joined <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>

                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("updatedAt")}
                >
                  <div className="flex items-center gap-1">
                    Updated <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>

                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="bg-muted animate-pulse h-8 rounded"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-64 text-center text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user: any, index: number) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-muted-foreground font-medium">
                      {startIndex + index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="h-10 w-10 rounded-full overflow-hidden border bg-muted">
                        <img
                          src={
                            user.image ??
                            "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=128"
                          }
                          alt={user?.name ?? "user"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      {user.name || "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "ADMIN"
                            ? "capitalize bg-[#1cb89e]/10 text-[#1cb89e] border-[#1cb89e]/30"
                            : user.role === "TUTOR"
                              ? "capitalize bg-purple-100 text-purple-800 border-purple-200"
                              : "capitalize bg-blue-100 text-blue-800 border-blue-200"
                        }
                      >
                        {user.role?.toLowerCase() || "user"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.uniqueStatus
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {user.uniqueStatus ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {moment(user.createdAt).format("MMM D, YYYY")}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {user.updatedAt && moment(user.updatedAt).fromNow()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={user.uniqueStatus ?? false}
                          onCheckedChange={() =>
                            handleToggleStatus(
                              user.id,
                              user.uniqueStatus ?? false,
                            )
                          }
                          aria-label="Toggle user status"
                        />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleView(user.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(user.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                 handleDelete(user.id)
                              }}
                              className="text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

          {filteredUsers.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-3 py-2">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }).map(
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className={
                            page === currentPage
                              ? "bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white"
                              : ""
                          }
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    },
                  )}
                  {totalPages > 7 && <span className="px-2 py-2">...</span>}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
