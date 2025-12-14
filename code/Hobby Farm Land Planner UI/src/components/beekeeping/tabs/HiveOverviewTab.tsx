import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Calendar, MapPin, Edit, Image as ImageIcon, FileText } from "lucide-react";
import type { Hive } from "../types";

interface HiveOverviewTabProps {
  hive: Hive;
  onEdit?: () => void;
}

export function HiveOverviewTab({ hive, onEdit }: HiveOverviewTabProps) {
  const getHiveTypeLabel = (type: Hive["type"]) => {
    const labels: Record<Hive["type"], string> = {
      langstroth: "Langstroth",
      "top-bar": "Top Bar",
      warre: "Warré",
      other: "Other",
    };
    return labels[type];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getHiveAge = () => {
    const installDate = new Date(hive.installDate);
    const now = new Date();
    const months = Math.floor(
      (now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    if (months < 1) return "Less than 1 month";
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""}`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0)
      return `${years} year${years !== 1 ? "s" : ""}`;
    return `${years} year${years !== 1 ? "s" : ""}, ${remainingMonths} month${
      remainingMonths !== 1 ? "s" : ""
    }`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-2">Hive Type</div>
          <div className="text-2xl font-semibold mb-1">
            {getHiveTypeLabel(hive.type)}
          </div>
          <div className="text-sm text-muted-foreground">
            {hive.apiaryName || "No apiary assigned"}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-2">Colony Age</div>
          <div className="text-2xl font-semibold mb-1">{getHiveAge()}</div>
          <div className="text-sm text-muted-foreground">
            Installed {formatDate(hive.installDate)}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground mb-2">Queen Status</div>
          <div className="text-2xl font-semibold mb-1">
            {hive.queenStatus === "sighted"
              ? "Sighted"
              : hive.queenStatus === "missing"
              ? "Missing"
              : "Unknown"}
          </div>
          <div className="text-sm text-muted-foreground">
            {hive.queenMarked && hive.queenColor
              ? `Marked ${hive.queenColor}`
              : "Not marked"}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Hive Details</h3>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Hive Name</div>
              <div className="font-medium">{hive.name}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Location / Apiary
              </div>
              <div className="font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {hive.location || "Not specified"}
                {hive.apiaryName && ` (${hive.apiaryName})`}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Install Date</div>
              <div className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDate(hive.installDate)}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Last Inspection
              </div>
              <div className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {hive.lastInspectionDate
                  ? formatDate(hive.lastInspectionDate)
                  : "Never"}
              </div>
            </div>
          </div>

          {hive.queenMarked && (
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground mb-2">
                Queen Information
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Marking Color:{" "}
                  </span>
                  <span className="font-medium">{hive.queenColor || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Status: </span>
                  <span className="font-medium">
                    {hive.queenStatus === "sighted"
                      ? "Sighted"
                      : hive.queenStatus === "missing"
                      ? "Missing"
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          )}
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

        {!hive.photos || hive.photos.length === 0 ? (
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
            {hive.photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square bg-muted rounded-lg overflow-hidden"
              >
                <img
                  src={photo}
                  alt={`${hive.name} photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
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

        {hive.notes ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {hive.notes}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No notes yet. Click Edit to add notes about this hive.
            </p>
          </div>
        )}
      </div>

      {/* Beekeeping Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Hive Management Tip
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Regular inspections every 7-14 days during active season help you
              catch issues early. Look for signs of the queen, check brood
              patterns, and monitor food stores. Always work calmly and avoid
              inspecting on cold, windy, or rainy days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
