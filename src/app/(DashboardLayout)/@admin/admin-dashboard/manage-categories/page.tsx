// app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MdCategory } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  MoreVertical,
  Hash,
  Type,
  Link2,
  Image as ImageIcon
} from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  extractData
} from "@/hooks/useCategories";
import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import USPagination from "@/components/shared/USPagination";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Category = {
  id: number;
  name: string;
  slug: string | null;
  image: string | null;
};

export default function ManageCategories() {
  // Filtering and Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Categories from Backend
  const { data: response, isLoading: loading } = useCategories({
    searchTerm: debouncedSearch || undefined,
    page,
    limit: 10,
    sortBy,
    sortOrder
  });

  const categories = extractData(response) as Category[];
  const meta = (response as any)?.meta || (response as any)?.data?.meta;

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    setName("");
    setSlug("");
    setImage("");
    setFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setIsEditing(true);
    setSelectedCategory(cat);
    setName(cat.name);
    setSlug(cat.slug || "");
    setImage(cat.image || "");
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      image: image.trim() || undefined,
    };

    try {
      if (isEditing && selectedCategory) {
        await toast.promise(updateCategoryMutation.mutateAsync({ id: selectedCategory.id, data: payload }), {
          loading: "Updating category...",
          success: <b>Category updated successfully!</b>,
          error: (err) => <b>{err.message || "Failed to update category"}</b>,
        });
      } else {
        await toast.promise(createCategoryMutation.mutateAsync(payload), {
          loading: "Creating category...",
          success: <b>Category created successfully!</b>,
          error: (err) => <b>{err.message || "Failed to create category"}</b>,
        });
        setPage(1);
      }
      setFormOpen(false);
      setName("");
      setSlug("");
      setImage("");
    } catch (err: any) {}
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await toast.promise(deleteCategoryMutation.mutateAsync(selectedCategory.id), {
        loading: "Removing category...",
        success: <b>Category successfully deleted!</b>,
        error: (err) => <b>{err.message || "Failed to delete category"}</b>,
      });
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (error) { }
  };

  const isFiltered = searchQuery !== "" || sortBy !== "id" || sortOrder !== "asc";

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSortBy("id");
    setSortOrder("asc");
    setPage(1);
  };

  return (
    <div className="pb-10 max-w-screen-2xl mx-auto space-y-4">
      <DashboardPagesHeader
        title="Manage Categories"
        subtitle="Organize and classify your course offerings"
        icon={MdCategory}
      />

      {/* Toolbar */}
      <div className="flex flex-row gap-2 sm:gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
          <Input
            placeholder="Search by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-card border-none shadow-sm rounded-xl focus-visible:ring-[#1cb89e]/30 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={!isFiltered}
            className="hidden sm:flex h-10 px-6 rounded-xl bg-card border-none shadow-sm hover:bg-muted font-bold text-xs disabled:opacity-50 transition-all active:scale-95"
          >
            Reset
          </Button>

          <Button 
            onClick={handleOpenCreate}
            className="h-10 px-4 sm:px-6 rounded-xl bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1cb89e]/20 transition-all active:scale-95"
          >
            <Plus className="sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Category</span>
          </Button>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md rounded-xl border border-border/50 shadow-md p-0 overflow-hidden bg-card">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-black">{isEditing ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              {isEditing ? "Update existing category details" : "Create a new organizational category"}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Graphic Design"
                className="h-12 bg-muted/30 border-none rounded-xl font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug (Optional)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. graphic-design"
                className="h-12 bg-muted/30 border-none rounded-xl font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Image URL</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-12 bg-muted/30 border-none rounded-xl font-bold"
              />
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/10 border-t border-border/50 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-none bg-muted/30 hover:bg-muted"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              className="h-10 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-[#1cb89e]/20 transition-all active:scale-95"
            >
              {(createCategoryMutation.isPending || updateCategoryMutation.isPending) ? "Saving..." : isEditing ? "Update Category" : "Save Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Section */}
      <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-20 font-black text-[10px] uppercase tracking-widest pl-8 text-muted-foreground text-center">
                  <Hash className="w-3 h-3 mx-auto" />
                </TableHead>
                <TableHead className="w-16 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Image</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Type className="w-3 h-3" /> Name
                  </div>
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-3 h-3" /> Slug
                  </div>
                </TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest pr-8 text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse border-border/30">
                    <TableCell colSpan={5} className="p-4">
                      <div className="h-12 bg-muted/40 rounded-xl w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                      <MdCategory className="w-12 h-12" />
                      <p className="font-black text-xs uppercase tracking-widest">No categories found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat, index) => (
                  <TableRow key={cat.id} className="group border-border/30 hover:bg-muted/20 transition-colors">
                    <TableCell className="pl-8 text-center">
                      <span className="font-mono text-[10px] font-black text-muted-foreground opacity-50">
                        {((page - 1) * 10 + index + 1).toString().padStart(2, "0")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-lg bg-muted/50 border border-border/50 overflow-hidden flex items-center justify-center">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground opacity-30" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-sm text-foreground">{cat.name}</span>
                    </TableCell>
                    <TableCell>
                      <code className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                        /{cat.slug || "n-a"}
                      </code>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted transition-all">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-200">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(cat)}
                            className="rounded-lg font-black text-[10px] uppercase tracking-widest p-3 cursor-pointer focus:bg-[#1cb89e]/10 focus:text-[#1cb89e]"
                          >
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsDeleteOpen(true);
                            }}
                            className="rounded-lg font-black text-[10px] uppercase tracking-widest p-3 cursor-pointer text-rose-600 focus:bg-rose-600 focus:text-white"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="mt-4  border-none rounded-xl overflow-hidden shadow-sm">
          <USPagination
            page={page}
            totalPage={meta.totalPage}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md rounded-xl border border-border/50 shadow-sm p-6 bg-card text-center">
          <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
            <Trash2 className="w-8 h-8" />
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-black text-foreground">Remove Category?</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-sm">
              Are you sure you want to delete <b>{selectedCategory?.name}</b>? This may affect courses using this category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/50 bg-muted/30 hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteCategoryMutation.isPending}
              className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm transition-all active:scale-95"
            >
              {deleteCategoryMutation.isPending ? "Removing..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}