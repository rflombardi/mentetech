import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({ value, onChange, placeholder = "Selecionar data e hora", disabled }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(
    value ? format(value, "HH:mm") : "09:00"
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange(undefined);
      return;
    }

    // Parse time and combine with selected date
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0);
    
    onChange(newDate);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    
    if (value) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              <span className="flex items-center gap-2">
                {format(value, "PPP", { locale: ptBR })}
                <Clock className="h-3 w-3 text-muted-foreground" />
                {format(value, "HH:mm")}
              </span>
            ) : (
              placeholder
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="border-b p-3">
            <Label htmlFor="time-input" className="text-sm font-medium">
              Horário de Publicação
            </Label>
            <Input
              id="time-input"
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              handleDateSelect(date);
              if (date) setIsOpen(false);
            }}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      {value && (
        <div className="text-xs text-muted-foreground">
          📅 Será publicado em: <strong>{format(value, "PPP 'às' HH:mm", { locale: ptBR })}</strong>
        </div>
      )}
    </div>
  );
}