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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";
import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";

type Category = {
  id: number;
  name: string;
  slug: string | null;
};

export default function ManageCategories() {
  const { data: categoriesData = [], isLoading: loading } = useCategories();
  const categories = categoriesData as Category[];
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search/filter effect
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCategories(categories);
      setCurrentPage(1);
      return;
    }

    const lowerSearch = search.toLowerCase().trim();
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(lowerSearch)
    );

    setFilteredCategories(filtered);
    setCurrentPage(1); // reset to page 1 on search
  }, [search, categories]);

  // Create new category
  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const data = {
        name: name.trim(),
        slug: slug.trim() || undefined,
      };

      await createCategoryMutation.mutateAsync(data);

      toast.success("Category created successfully!");
      setFormOpen(false);
      setName("");
      setSlug("");
      setCurrentPage(1);
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    }
  };

  const handleEdit = (cat: Category) => {
    toast.info(`Edit category: ${cat.name} (coming soon)`);
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await toast.promise(deleteCategoryMutation.mutateAsync(categoryId), {
        loading: "Deleting Category...",
        success: <b>Category successfully deleted!</b>,
        error: (err) => <b>{err.message || "Failed to delete category"}</b>,
      });
    } catch (error) {
      // toast promise handles the error rendering
    }
  };

  // Pagination logic (now uses filteredCategories)
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="px-0 lg:px-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
        <DashboardPagesHeader
          title={"Manage Categories"}
          subtitle={"Create, edit and organize course categories"}
          icon={MdCategory}
        />

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for organizing courses.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Web Development"
                  disabled={createCategoryMutation.isPending}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. web-development"
                  disabled={createCategoryMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Used in URLs. Leave empty to auto-generate.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={createCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createCategoryMutation.isPending}>
                {createCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Search categories by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      
        <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
       
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-14">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>



                 <TableBody>
                 {loading ? (
                   Array.from({ length: 10 }).map((_, i) => (
                     <TableRow key={i}>
                       {Array.from({ length: 3 }).map((_, j) => (
                         <TableCell key={j}>
                           <div className="bg-muted animate-pulse h-8 rounded"></div>
                         </TableCell>
                       ))}
                     </TableRow>
                   ))
                 ) :categories?.length === 0 ? (
                     <TableRow>
                       <TableCell
                         colSpan={9}
                         className="h-48 text-center text-muted-foreground"
                       >
                         No Category  found
                       </TableCell>
                     </TableRow>
                   ) : (
                     categories.map((cat, index) => {
                      
                       return (
                       <TableRow key={cat.id}>
                        <TableCell className="font-medium text-muted-foreground">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {cat.slug || <span className="italic text-xs">auto-generated</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(cat)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                       );
                     })
                   )}
                 </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-3 py-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}{" "}
                    categories
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
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
            </>
        
        </div>
     
    </div>
  );
}