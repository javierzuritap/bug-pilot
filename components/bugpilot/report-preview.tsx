"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { bugReportSchema, severityLevels, priorityLevels, type BugReport } from "@/lib/schemas";

// Internal form shape: steps are objects (RHF's useFieldArray wants stable keys),
// mapped back to string[] before being handed to the rest of the app.
const formSchema = bugReportSchema.extend({
  stepsToReproduce: z.array(z.object({ text: z.string().min(1, "Step can't be empty") })).min(1),
});
type FormValues = z.infer<typeof formSchema>;

function toFormValues(report: BugReport): FormValues {
  return { ...report, stepsToReproduce: report.stepsToReproduce.map((text) => ({ text })) };
}

function toBugReport(values: FormValues): BugReport {
  return { ...values, stepsToReproduce: values.stepsToReproduce.map((s) => s.text) };
}

export function ReportPreview({
  report,
  onChange,
}: {
  report: BugReport;
  onChange: (report: BugReport) => void;
}) {
  const { register, control, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormValues(report),
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "stepsToReproduce" });

  useEffect(() => {
    const subscription = watch((values) => {
      if (!values) return;
      onChange(toBugReport(values as FormValues));
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Report preview</CardTitle>
        <CardDescription>Everything below is editable before you export it.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" rows={3} {...register("summary")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Steps to reproduce</Label>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <span className="mt-2.5 w-5 shrink-0 text-right text-xs font-mono text-muted-foreground">
                  {index + 1}.
                </span>
                <Input {...register(`stepsToReproduce.${index}.text`)} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label="Remove step"
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit gap-1.5"
            onClick={() => append({ text: "" })}
          >
            <Plus className="size-3.5" />
            Add step
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expected">Expected behaviour</Label>
            <Textarea id="expected" rows={3} {...register("expectedBehaviour")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="actual">Actual behaviour</Label>
            <Textarea id="actual" rows={3} {...register("actualBehaviour")} />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <Label>Environment</Label>
          <div className="grid gap-3 sm:grid-cols-4">
            <Input placeholder="Browser" {...register("environment.browser")} />
            <Input placeholder="OS" {...register("environment.os")} />
            <Input placeholder="Device" {...register("environment.device")} />
            <Input placeholder="App version" {...register("environment.appVersion")} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="severity">Severity</Label>
            <Select id="severity" {...register("severity")}>
              {severityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="priority">Priority</Label>
            <Select id="priority" {...register("priority")}>
              {priorityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Additional notes</Label>
          <Textarea id="notes" rows={2} {...register("additionalNotes")} />
        </div>

        {formState.errors.stepsToReproduce && (
          <p className="text-xs text-destructive">Every step needs some text.</p>
        )}
      </CardContent>
    </Card>
  );
}
