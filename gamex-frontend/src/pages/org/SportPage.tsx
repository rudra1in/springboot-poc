/**
 * ORG-03 — Define Sport (Create / Update)
 *
 * Maps 1-to-1 with the UPDATE_SPORT.png design:
 *   Section 1 — Sport Specifications  (name, type, status, description)
 *   Section 2 — Team Roster Configuration  (playersPerTeam, referees, scorers)
 *   Footer actions — Cancel / Save Configuration
 *
 * Route:
 *   /configuration/sports/new          → create mode
 *   /configuration/sports/:id/edit     → edit mode
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sportsApi, type SportRequest } from '@/api/sports';
import { ChevronRight, Dumbbell } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// ── Zod schema ───────────────────────────────────────────────────────────────

const sportSchema = z.object({
  name: z
    .string()
    .min(1, 'Sport name is required')
    .max(100, 'Must be 100 characters or fewer'),
  sportType: z.enum(['TEAM', 'INDIVIDUAL', 'ESPORT'], {
    required_error: 'Sport type is required',
  }),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    required_error: 'Status is required',
  }),
  description: z.string().max(2000, 'Must be 2000 characters or fewer').optional(),
  playersPerTeam: z
    .number({ invalid_type_error: 'Enter a valid number' })
    .int()
    .min(1, 'Must be at least 1'),
  numberOfReferees: z
    .number({ invalid_type_error: 'Enter a valid number' })
    .int()
    .min(0)
    .optional()
    .or(z.literal('')),
  numberOfScorers: z
    .number({ invalid_type_error: 'Enter a valid number' })
    .int()
    .min(0)
    .optional()
    .or(z.literal('')),
});

type SportFormValues = z.infer<typeof sportSchema>;

// ── Page component ───────────────────────────────────────────────────────────

export default function SportPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();

  // Fetch existing sport in edit mode
  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ['sport', id],
    queryFn: () => sportsApi.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SportFormValues>({
    resolver: zodResolver(sportSchema),
    defaultValues: existing
      ? {
          name: existing.name,
          sportType: existing.sportType,
          status: existing.status,
          description: existing.description ?? '',
          playersPerTeam: existing.playersPerTeam,
          numberOfReferees: existing.numberOfReferees ?? undefined,
          numberOfScorers: existing.numberOfScorers ?? undefined,
        }
      : {
          status: 'ACTIVE',
          sportType: 'TEAM',
        },
  });

  // Reset when existing data loads (edit mode)
  if (existing && !isSubmitting) {
    // Only reset once on load — react-hook-form tracks dirty state
  }

  const { mutateAsync: save } = useMutation({
    mutationFn: (payload: SportRequest) =>
      isEdit ? sportsApi.update(id!, payload) : sportsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
    },
  });

  const onSubmit = async (values: SportFormValues) => {
    try {
      const payload: SportRequest = {
        name: values.name,
        sportType: values.sportType,
        status: values.status,
        description: values.description || undefined,
        playersPerTeam: values.playersPerTeam,
        numberOfReferees:
          values.numberOfReferees === '' ? undefined : values.numberOfReferees,
        numberOfScorers:
          values.numberOfScorers === '' ? undefined : values.numberOfScorers,
      };
      await save(payload);
      toast({
        title: isEdit ? 'Sport updated' : 'Sport created',
        description: `"${values.name}" has been saved successfully.`,
      });
      navigate('/configuration/sports');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Something went wrong. Please try again.';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  if (isEdit && loadingExisting) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-sm">Loading sport…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans">
      {/* ── Top nav bar ─────────────────────────────────────────────────── */}
      <header className="h-14 bg-[#0D1B2E] flex items-center px-6 gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {/* GameX wordmark placeholder */}
          <Dumbbell className="text-[#F5C518] w-6 h-6" />
          <span className="text-white font-semibold text-sm tracking-wide">GameX</span>
        </div>
        <div className="h-5 w-px bg-white/20 mx-2" />
        <span className="text-[#F5C518] text-xs font-medium tracking-widest uppercase flex items-center gap-1">
          <Dumbbell className="w-3.5 h-3.5" />
          Sport Management
        </span>
        <div className="ml-auto">
          <div className="w-8 h-8 rounded-full bg-slate-500 ring-2 ring-white/20" />
        </div>
      </header>

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-slate-400 uppercase tracking-widest mb-6">
          <span
            className="hover:text-slate-600 cursor-pointer"
            onClick={() => navigate('/configuration')}
          >
            Configuration
          </span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-medium">Sport Detail</span>
        </nav>

        {/* Page heading */}
        <h1 className="text-3xl font-bold text-[#0D1B2E] mb-1">Define Sport</h1>
        <p className="text-slate-500 text-sm mb-8">
          Register or update competition standards for the GameX platform.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ── Section 1: Sport Specifications ──────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 bg-[#F5C518] rounded-full" />
              <h2 className="text-base font-semibold text-[#0D1B2E]">
                Sport Specifications
              </h2>
            </div>

            {/* Sport Name */}
            <div className="mb-5">
              <Label htmlFor="name" className={fieldLabelCls(!!errors.name)}>
                Sport Name <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g. Apex Legends: Global Series"
                className={inputCls(!!errors.name)}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* Sport Type + Status — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Sport Type */}
              <div>
                <Label htmlFor="sportType" className={fieldLabelCls(!!errors.sportType)}>
                  Sport Type <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Controller
                  name="sportType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={inputCls(!!errors.sportType)}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEAM">Team Competition</SelectItem>
                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        <SelectItem value="ESPORT">Esport</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.sportType?.message} />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className={fieldLabelCls(!!errors.status)}>
                  Status <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={inputCls(!!errors.status)}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.status?.message} />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className={fieldLabelCls(!!errors.description)}>
                Description
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Provide a brief overview of the sport and its ruleset…"
                className={cn(inputCls(!!errors.description), 'min-h-[110px] resize-none')}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </section>

          {/* ── Section 2: Team Roster Configuration ─────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 bg-[#F5C518] rounded-full" />
              <h2 className="text-base font-semibold text-[#0D1B2E]">
                Team Roster Configuration
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Players per team */}
              <div>
                <Label
                  htmlFor="playersPerTeam"
                  className={fieldLabelCls(!!errors.playersPerTeam)}
                >
                  Players per Team <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Input
                  id="playersPerTeam"
                  type="number"
                  min={1}
                  placeholder="e.g. 5"
                  {...register('playersPerTeam', { valueAsNumber: true })}
                  className={inputCls(!!errors.playersPerTeam)}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Including starters &amp; bench.
                </p>
                <FieldError message={errors.playersPerTeam?.message} />
              </div>

              {/* Number of referees */}
              <div>
                <Label
                  htmlFor="numberOfReferees"
                  className={fieldLabelCls(!!errors.numberOfReferees)}
                >
                  Number of Referees
                </Label>
                <Input
                  id="numberOfReferees"
                  type="number"
                  min={0}
                  placeholder="e.g. 2"
                  {...register('numberOfReferees', { valueAsNumber: true })}
                  className={inputCls(!!errors.numberOfReferees)}
                />
                <FieldError message={errors.numberOfReferees?.message} />
              </div>

              {/* Number of scorers */}
              <div>
                <Label
                  htmlFor="numberOfScorers"
                  className={fieldLabelCls(!!errors.numberOfScorers)}
                >
                  Number of Scorers
                </Label>
                <Input
                  id="numberOfScorers"
                  type="number"
                  min={0}
                  placeholder="e.g. 1"
                  {...register('numberOfScorers', { valueAsNumber: true })}
                  className={inputCls(!!errors.numberOfScorers)}
                />
                <FieldError message={errors.numberOfScorers?.message} />
              </div>
            </div>
          </section>

          {/* ── Footer actions ────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0D1B2E] hover:bg-[#162840] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {isSubmitting ? 'Saving…' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

// ── Micro helpers ─────────────────────────────────────────────────────────────

function fieldLabelCls(hasError: boolean) {
  return cn(
    'block text-[10px] font-semibold tracking-widest uppercase mb-1.5',
    hasError ? 'text-red-500' : 'text-slate-500',
  );
}

function inputCls(hasError: boolean) {
  return cn(
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300',
    'focus:outline-none focus:ring-2 focus:ring-[#0D1B2E]/20 focus:border-[#0D1B2E]',
    'transition-colors',
    hasError ? 'border-red-400' : 'border-slate-200',
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] text-red-500 mt-1">{message}</p>;
}
