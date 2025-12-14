import { useState } from "react";
import { Bird, Plus, Search, Grid3x3, List } from "lucide-react";
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
import { EmptyState } from "../ui/EmptyState";

interface Flock {
  id: string;
  name: string;
  birdCount: number;
  breed: string;
  avgEggsPerDay: number;
  createdDate: string;
}

interface FlockManagementProps {
  onAddFlock?: () => void;
  onViewFlock?: (flockId: string) => void;
}

export function FlockManagement({ onAddFlock, onViewFlock }: FlockManagementProps) {
  const [flocks] = useState<Flock[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlocks = flocks.filter(flock =>
    flock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flock.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Flock Management</h1>
          <p className="text-muted-foreground">
            Manage your poultry flocks and track their details
          </p>
        </div>
        <Button onClick={onAddFlock}>
          <Plus className="w-4 h-4 mr-2" />
          Add Flock
        </Button>
      </div>

      {flocks.length > 0 && (
        <>
          {/* Search and View Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search flocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Flocks Display */}
      {flocks.length === 0 ? (
        <EmptyState
          icon={Bird}
          title="No flocks added yet"
          description="Start by adding your first flock to begin tracking egg production"
          action={{
            label: 'Add Your First Flock',
            onClick: onAddFlock || (() => {}),
          }}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlocks.map((flock) => (
            <div
              key={flock.id}
              className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card cursor-pointer"
              onClick={() => onViewFlock?.(flock.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bird className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3>{flock.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {flock.breed}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Birds</p>
                  <p className="text-lg font-semibold">{flock.birdCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">7-Day Avg</p>
                  <p className="text-lg font-semibold">{flock.avgEggsPerDay}/day</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewFlock?.(flock.id);
                }}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flock Name</TableHead>
                <TableHead>Bird Count</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Avg Eggs/Day (7-day)</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlocks.map((flock) => (
                <TableRow
                  key={flock.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewFlock?.(flock.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Bird className="w-4 h-4 text-primary" />
                      <span className="font-medium">{flock.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{flock.birdCount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{flock.breed}</Badge>
                  </TableCell>
                  <TableCell>{flock.avgEggsPerDay}/day</TableCell>
                  <TableCell>
                    {new Date(flock.createdDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewFlock?.(flock.id);
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
      )}
    </div>
  );
}