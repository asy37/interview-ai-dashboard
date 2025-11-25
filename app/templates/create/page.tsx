"use client";

import { useState } from "react";
import { useForm, useFieldArray, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ChevronsUpDown, Check, GripVertical, Trash2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const templateCategories = [
  { value: "technical", label: "Teknik" },
  { value: "behavioral", label: "Davranışsal" },
  { value: "culture", label: "Kültür" },
  { value: "leadership", label: "Liderlik" },
  { value: "custom", label: "Özel" },
] as const;

const questionCategories = [
  { value: "technical", label: "Teknik" },
  { value: "behavioral", label: "Davranışsal" },
  { value: "culture", label: "Kültür" },
  { value: "leadership", label: "Liderlik" },
] as const;

const difficultyOptions = [
  { value: "easy", label: "Kolay" },
  { value: "medium", label: "Orta" },
  { value: "hard", label: "Zor" },
] as const;

const aiCriteriaOptions = [
  { value: "communication", label: "İletişim" },
  { value: "problemSolving", label: "Problem Çözme" },
  { value: "criticalThinking", label: "Eleştirel Düşünme" },
  { value: "teamwork", label: "Takım Çalışması" },
  { value: "technicalDepth", label: "Teknik Derinlik" },
  { value: "clarity", label: "Anlatım Netliği" },
  { value: "adaptability", label: "Uyum Sağlama" },
] as const;

const questionSchema = z.object({
  id: z.string(),
  questionText: z.string().trim().min(1, "Soru metni zorunludur."),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.enum(["technical", "behavioral", "culture", "leadership"]),
  aiCriteria: z
    .array(
      z.enum([
        "communication",
        "problemSolving",
        "criticalThinking",
        "teamwork",
        "technicalDepth",
        "clarity",
        "adaptability",
      ])
    )
    .min(1, "En az bir değerlendirme kriteri seçilmelidir."),
  notes: z.string().optional(),
  expectedKeywords: z
    .array(z.string().trim().min(1))
    .max(15, "En fazla 15 anahtar kelime eklenebilir.")
    .optional(),
  order: z.number().nonnegative(),
});

const templateSchema = z.object({
  templateName: z.string().trim().min(1, "Şablon adı zorunludur."),
  description: z.string().optional(),
  category: z.enum(["technical", "behavioral", "culture", "leadership", "custom"]),
  questions: z.array(questionSchema).min(1, "En az bir soru eklemelisiniz."),
});

type TemplateFormValues = z.infer<typeof templateSchema>;
type QuestionFormValues = z.infer<typeof questionSchema>;

const createTemplateRequest = async (payload: TemplateFormValues) => {
  const response = await axios.post("/api/templates", payload);
  return response.data;
};

const createEmptyQuestion = (order: number): QuestionFormValues => ({
  id: crypto.randomUUID(),
  questionText: "",
  difficulty: "medium",
  category: "technical",
  aiCriteria: ["communication"],
  notes: "",
  expectedKeywords: [],
  order,
});

const MultiSelect = ({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);

  const toggleValue = (nextValue: string) => {
    if (value.includes(nextValue)) {
      onChange(value.filter((item) => item !== nextValue));
    } else {
      onChange([...value, nextValue]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between",
            value.length === 0 && "text-muted-foreground"
          )}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {value.map((item) => {
                const option = aiCriteriaOptions.find((opt) => opt.value === item);
                return (
                  <Badge key={item} variant="secondary">
                    {option?.label ?? item}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Kriter ara..." />
          <CommandList>
            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
            <CommandGroup>
              {aiCriteriaOptions.map((option) => {
                const selected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const KeywordInput = ({
  value,
  onChange,
}: {
  value: string[] | undefined;
  onChange: (next: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddKeyword = () => {
    if (!inputValue.trim()) return;
    const next = [...(value ?? []), inputValue.trim()];
    onChange(next.slice(0, 15));
    setInputValue("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAddKeyword();
            }
          }}
          placeholder="Anahtar kelime yazın ve Enter'a basın"
        />
        <Button type="button" variant="secondary" onClick={handleAddKeyword}>
          Ekle
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(value ?? []).map((keyword) => (
          <Badge key={keyword} variant="outline" className="gap-1">
            {keyword}
            <button
              type="button"
              aria-label="Anahtar kelimeyi sil"
              onClick={() =>
                onChange((value ?? []).filter((item) => item !== keyword))
              }
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

type SortableQuestionCardProps = {
  fieldId: string;
  index: number;
  onRemove: () => void;
  form: UseFormReturn<TemplateFormValues>;
};

const SortableQuestionCard = ({
  fieldId,
  index,
  onRemove,
  form,
}: SortableQuestionCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "border shadow-sm transition-all",
        isDragging && "border-primary/70 shadow-lg"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="mt-1 text-muted-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <div>
            <CardTitle>Soru #{index + 1}</CardTitle>
            <CardDescription>Soru içeriğini yapılandırın</CardDescription>
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <FormField
          control={form.control}
          name={`questions.${index}.questionText`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soru Metni</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adaya sorulacak soru..."
                  className="min-h-[90px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name={`questions.${index}.category`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string | undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {questionCategories.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`questions.${index}.difficulty`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zorluk</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex gap-4"
                    onValueChange={field.onChange}
                    value={field.value as string | undefined}
                  >
                    {difficultyOptions.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={`questions.${index}.aiCriteria`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Değerlendirme Kriterleri</FormLabel>
              <FormControl>
                <MultiSelect
                  value={(field.value as string[] | undefined) ?? []}
                  onChange={field.onChange}
                  placeholder="Kriter seçin"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`questions.${index}.expectedKeywords`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beklenen Anahtar Kelimeler</FormLabel>
              <FormControl>
                <KeywordInput
                  value={field.value as string[] | undefined}
                  onChange={(next) => field.onChange(next)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`questions.${index}.notes`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Soruya dair ek bağlam..."
                  className="min-h-[70px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default function CreateTemplatePage() {
  const t = useTranslations("templates");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      templateName: "",
      description: "",
      category: "technical",
      questions: [createEmptyQuestion(1)],
    },
    mode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const mutation = useMutation({
    mutationFn: createTemplateRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Şablon kaydedildi",
        description: "Yeni soru şablonunuz listeye eklendi.",
      });
      form.reset({
        templateName: "",
        description: "",
        category: "technical",
        questions: [createEmptyQuestion(1)],
      });
    },
    onError: (error) => {
      toast({
        title: "Bir hata oluştu",
        description:
          axios.isAxiosError(error)
            ? error.response?.data?.message ?? "Lütfen tekrar deneyin."
            : "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: TemplateFormValues) => {
    mutation.mutate({
      ...values,
      questions: values.questions.map((question, index) => ({
        ...question,
        order: index + 1,
      })),
    });
  };

  const handleAddQuestion = () => {
    append(createEmptyQuestion(fields.length + 1));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);
    const currentQuestions = form.getValues("questions");
    const reordered = arrayMove(currentQuestions, oldIndex, newIndex).map(
      (question, index) => ({
        ...question,
        order: index + 1,
      })
    );
    replace(reordered);
  };

  return (
    <main className="container mx-auto max-w-5xl space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-semibold">{t("createPage.title") ?? "Soru Şablonu Oluştur"}</h1>
        <p className="text-muted-foreground">
          {t("createPage.subtitle") ??
            "AI mülakatlarında kullanılacak soru setini yapılandırın."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Şablon Bilgileri</CardTitle>
              <CardDescription>
                Şablon genel ayarlarını ve kategori bilgilerini girin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="templateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şablon Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn. Backend Teknik Değerlendirme" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="İsteğe bağlı kısa açıklama"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şablon Kategorisi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string | undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templateCategories.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Sorular</h2>
                <p className="text-sm text-muted-foreground">
                  Soru kartlarını ekleyin, düzenleyin ve sürükleyip sıralayın.
                </p>
              </div>
              <Button type="button" onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Soru Ekle
              </Button>
            </div>
            <Separator />
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <SortableQuestionCard
                      key={field.id}
                      fieldId={field.id}
                      index={index}
                      onRemove={() => remove(index)}
                      form={form}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </section>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={form.formState.isSubmitting || mutation.isPending}
            >
              Temizle
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || mutation.isPending}
            >
              {mutation.isPending ? "Kaydediliyor..." : "Şablonu Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}

