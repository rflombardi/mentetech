import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit3, CheckCircle2, Clock } from "lucide-react";
import type { PostStatus } from "@/types/blog";

interface StatusSelectorProps {
  value: PostStatus;
  onChange: (status: PostStatus) => void;
  className?: string;
}

const statusConfig = {
  RASCUNHO: {
    label: "Rascunho",
    icon: Edit3,
    color: "bg-muted text-muted-foreground",
    emoji: "📝"
  },
  PUBLICADO: {
    label: "Publicado",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    emoji: "✅"
  },
  AGENDADO: {
    label: "Agendado",
    icon: Clock,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    emoji: "🕒"
  }
} as const;

export function StatusSelector({ value, onChange, className }: StatusSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          <div className="flex items-center gap-2">
            {statusConfig[value] && (
              <>
                <span className="text-base">{statusConfig[value].emoji}</span>
                <span>{statusConfig[value].label}</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([status, config]) => (
          <SelectItem key={status} value={status as PostStatus}>
            <div className="flex items-center gap-2">
              <span className="text-base">{config.emoji}</span>
              <span>{config.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function StatusBadge({ status }: { status: PostStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge variant="secondary" className={`${config.color} border-0`}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export { statusConfig };