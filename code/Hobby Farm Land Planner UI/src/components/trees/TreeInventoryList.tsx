import { useState } from "react";
import { Search, MapPin, Filter, Leaf, TreeDeciduous, TreePine, Apple, Sprout } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Tree {
  id: string;
  commonName: string;
  scientificName: string;
  type: string;
  age?: number;
  plantedYear?: number;
  status: "healthy" | "young" | "declining" | "removed";
  location: { x: number; y: number };
  purpose: string[];
  isNative: boolean;
  notes?: string;
}

interface TreeInventoryListProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
}

export function TreeInventoryList({ trees, onSelectTree }: TreeInventoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getTreeIcon = (type: string) => {
    switch (type) {
      case "maple": return TreeDeciduous;
      case "fruit": return Apple;
      case "conifer": return TreePine;
      case "nut": return Sprout;
      default: return Leaf;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800 border-green-200";
      case "young": return "bg-blue-100 text-blue-800 border-blue-200";
      case "declining": return "bg-amber-100 text-amber-800 border-amber-200";
      case "removed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredTrees = trees.filter(tree => {
    const matchesSearch = 
      tree.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || tree.status === statusFilter;
    const matchesType = typeFilter === "all" || tree.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (trees.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <TreePine className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl mb-2">No Trees Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your tree inventory by adding existing trees or planning future plantings.
            </p>
            <Button size="lg" className="gap-2">
              <TreePine className="w-5 h-5" />
              Add Your First Tree
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="border-b bg-card px-8 py-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by species name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48 h-11">
              <SelectValue placeholder="Tree Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="maple">Maple</SelectItem>
              <SelectItem value="fruit">Fruit</SelectItem>
              <SelectItem value="conifer">Conifer</SelectItem>
              <SelectItem value="nut">Nut</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 h-11">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="young">Young</SelectItem>
              <SelectItem value="declining">Declining</SelectItem>
              <SelectItem value="removed">Removed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tree List */}
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-3">
          {filteredTrees.map((tree) => {
            const Icon = getTreeIcon(tree.type);
            const treeAge = tree.age || (tree.plantedYear ? new Date().getFullYear() - tree.plantedYear : null);

            return (
              <div
                key={tree.id}
                onClick={() => onSelectTree(tree)}
                className="bg-card border rounded-lg p-5 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="mb-1">{tree.commonName}</h4>
                        <p className="text-sm text-muted-foreground italic">
                          {tree.scientificName}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(tree.status)}
                      >
                        <span className="px-1 py-0.5">{tree.status}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {treeAge && (
                        <span>{treeAge} years old</span>
                      )}
                      {tree.isNative && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="px-1 py-0.5">Native</span>
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Location marked</span>
                      </div>
                    </div>

                    {tree.purpose.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {tree.purpose.map((purpose) => (
                          <Badge 
                            key={purpose} 
                            variant="secondary"
                            className="text-xs"
                          >
                            {purpose}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {tree.notes && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                        {tree.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Results Count */}
      <div className="border-t bg-card px-8 py-3">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTrees.length} of {trees.length} trees
        </p>
      </div>
    </div>
  );
}