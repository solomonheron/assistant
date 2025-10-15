import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PreferenceSectionProps {
  title: string;
  description: string;
  options: { value: string; label: string; description: string }[];
  value: string;
  onValueChange: (value: string) => void;
  testId?: string;
}

export function PreferenceSection({
  title,
  description,
  options,
  value,
  onValueChange,
  testId
}: PreferenceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onValueChange} className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg hover-elevate border border-transparent hover:border-border transition-all">
              <RadioGroupItem value={option.value} id={option.value} data-testid={`${testId}-${option.value}`} />
              <div className="flex-1 cursor-pointer" onClick={() => onValueChange(option.value)}>
                <Label htmlFor={option.value} className="cursor-pointer font-medium">
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
