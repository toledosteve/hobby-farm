import { useState } from "react";
import { TreePine, Plus, MapPin, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { EmptyState } from "../ui/EmptyState";

interface Tree {
  id: string;
  name: string;
  location: string;
  species: 'Sugar Maple' | 'Red Maple' | 'Black Maple';
  dbh: number; // Diameter at breast height
  taps: number;
  coordinates?: { lat: number; lng: number };
}

interface MapleTreesScreenProps {
  onAddTree?: () => void;
  onAddTap?: () => void;
}

export function MapleTreesScreen({ onAddTree, onAddTap }: MapleTreesScreenProps) {
  const [trees] = useState<Tree[]>([]);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTreeDetail, setShowTreeDetail] = useState(false);

  const filteredTrees = trees.filter(tree =>
    tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tree.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTreeClick = (tree: Tree) => {
    setSelectedTree(tree);
    setShowTreeDetail(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Maple Trees</h1>
          <p className="text-muted-foreground">
            Manage your sugar bush and track individual trees
          </p>
        </div>
        <Button onClick={onAddTree}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tree
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree Table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg">
          {trees.length === 0 ? (
            <EmptyState
              icon={TreePine}
              title="No trees added yet"
              description="Start building your sugar bush by adding maple trees to track"
              action={{
                label: 'Add Your First Tree',
                onClick: onAddTree || (() => {}),
              }}
            />
          ) : (
            <>
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tree ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Species</TableHead>
                      <TableHead>DBH</TableHead>
                      <TableHead>Taps</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrees.map((tree) => (
                      <TableRow
                        key={tree.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleTreeClick(tree)}
                      >
                        <TableCell>{tree.name}</TableCell>
                        <TableCell>{tree.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tree.species}</Badge>
                        </TableCell>
                        <TableCell>{tree.dbh}&quot;</TableCell>
                        <TableCell>
                          <Badge>{tree.taps}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTreeClick(tree);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>

        {/* Map Overlay Preview */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="mb-4">Map View</h3>
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tree locations will appear here</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Trees</span>
              <span className="font-medium">{trees.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Taps</span>
              <span className="font-medium">
                {trees.reduce((sum, tree) => sum + tree.taps, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Detail Sheet */}
      <Sheet open={showTreeDetail} onOpenChange={setShowTreeDetail}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedTree && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-primary" />
                  {selectedTree.name}
                </SheetTitle>
                <SheetDescription>{selectedTree.location}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Tree Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Species</p>
                    <Badge>{selectedTree.species}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Diameter at Breast Height
                    </p>
                    <p className="text-lg font-semibold">{selectedTree.dbh}&quot;</p>
                  </div>

                  {selectedTree.coordinates && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                      <p className="text-sm font-mono">
                        {selectedTree.coordinates.lat.toFixed(6)}, {selectedTree.coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Taps Section */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3>Taps ({selectedTree.taps})</h3>
                    <Button size="sm" onClick={onAddTap}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Tap
                    </Button>
                  </div>

                  {selectedTree.taps === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No taps installed on this tree
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {/* Mock tap list */}
                      <div className="p-3 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Tap #1</p>
                            <p className="text-xs text-muted-foreground">
                              Installed Mar 1, 2025
                            </p>
                          </div>
                          <Button size="sm" variant="ghost">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="border-t border-border pt-6 space-y-2">
                  <Button variant="outline" className="w-full">
                    Edit Tree Details
                  </Button>
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                    Remove Tree
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
