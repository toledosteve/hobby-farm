import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Calendar, MapPin, Edit, Image as ImageIcon, FileText } from "lucide-react";
import type { Flock } from "../types";

interface FlockOverviewTabProps {
  flock: Flock;
  onEdit?: () => void;
}

export function FlockOverviewTab({ flock, onEdit }: FlockOverviewTabProps) {
  const getBreedDisplay = (breeds: string[]) => {
    const breedNames: Record<string, string> = {
      'rhode-island-red': 'Rhode Island Red',
      'plymouth-rock': 'Plymouth Rock',
      'leghorn': 'Leghorn',
      'orpington': 'Orpington',
      'wyandotte': 'Wyandotte',
      'brahma': 'Brahma',
      'sussex': 'Sussex',
      'cornish-cross': 'Cornish Cross',
      'freedom-ranger': 'Freedom Ranger',
      'jersey-giant': 'Jersey Giant',
      'other': 'Mixed',
    };
    
    return breeds.map(b => breedNames[b] || 'Unknown').join(', ');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFlockAge = () => {
    if (!flock.hatchDate && !flock.acquiredDate) return null;
    const date = new Date(flock.hatchDate || flock.acquiredDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`;
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    if (weeks < 52) {
      const months = Math.floor(weeks / 4);
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    const years = Math.floor(weeks / 52);
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-2">Flock Type</div>
          <div className="text-2xl font-semibold mb-1 capitalize">
            {flock.type === 'layers' ? 'Laying Hens' : 'Meat Birds'}
          </div>
          <div className="text-sm text-muted-foreground">
            {getBreedDisplay(flock.breeds)}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-2">Bird Count</div>
          <div className="text-2xl font-semibold mb-1">
            {flock.birdCount}
          </div>
          <div className="text-sm text-muted-foreground">
            {flock.type === 'layers' ? 'laying hens' : 'broilers'}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-2">Age</div>
          <div className="text-2xl font-semibold mb-1">
            {getFlockAge() || 'Not set'}
          </div>
          <div className="text-sm text-muted-foreground">
            {flock.hatchDate ? `Hatched ${formatDate(flock.hatchDate)}` : `Acquired ${formatDate(flock.acquiredDate)}`}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Flock Details</h3>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Breed(s)</div>
              <div className="font-medium">{getBreedDisplay(flock.breeds)}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Housing Location</div>
              <div className="font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {flock.housingLocation || 'Not specified'}
              </div>
            </div>

            {flock.hatchDate && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Hatch Date</div>
                <div className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {formatDate(flock.hatchDate)}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm text-muted-foreground mb-1">Acquired Date</div>
              <div className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDate(flock.acquiredDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Photos</h3>
          <Button variant="outline" size="sm">
            <ImageIcon className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
        </div>

        {(!flock.photos || flock.photos.length === 0) ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-4">No photos yet</p>
            <Button variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Your First Photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flock.photos.map((photo, index) => (
              <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img src={photo} alt={`${flock.name} photo ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Notes</h3>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        {flock.notes ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">{flock.notes}</p>
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No notes yet. Click Edit to add notes about this flock.</p>
          </div>
        )}
      </div>
    </div>
  );
}
