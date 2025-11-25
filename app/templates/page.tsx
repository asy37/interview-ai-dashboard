'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import apiClient from '@/lib/api-client'
import type { MockTemplate } from '@/lib/mock-data'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Edit,
  Trash,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function TemplatesPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<MockTemplate | null>(null)

  const { data: templates = [], isLoading } = useQuery<MockTemplate[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await apiClient.get('/templates')
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: MockTemplate['id']) => {
      await apiClient.delete(`/templates/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      toast.success('Template deleted successfully')
      setDeleteDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to delete template')
    },
  })

  const duplicateMutation = useMutation({
    mutationFn: async (template: MockTemplate) => {
      const newTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
      }
      delete newTemplate.id
      await apiClient.post('/templates', newTemplate)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      toast.success('Template duplicated successfully')
    },
    onError: () => {
      toast.error('Failed to duplicate template')
    },
  })

  const handleDelete = (template: MockTemplate) => {
    setSelectedTemplate(template)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedTemplate) {
      deleteMutation.mutate(selectedTemplate.id)
    }
  }

  const handleDuplicate = (template: MockTemplate) => {
    duplicateMutation.mutate(template)
  }

  const columns = [
    {
      accessorKey: 'name',
      header: t('templateName'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.getValue('name')}</span>
          {row.original.isFavorite && (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'questionCount',
      header: t('questions'),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('questionCount')} questions
        </Badge>
      ),
    },
    {
      accessorKey: 'createdDate',
      header: t('createdDate'),
      cell: ({ row }) => format(new Date(row.getValue('createdDate')), 'PPP'),
    },
    {
      accessorKey: 'createdBy',
      header: t('createdBy'),
    },
    {
      accessorKey: 'usageCount',
      header: t('usageCount'),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.getValue('usageCount')} times
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const template = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                <Copy className="mr-2 h-4 w-4" />
                {t('duplicate')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                <Link href={`/templates/${row.original.id}`}>{t('edit')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                {t('addToFavorites')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(template)}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: templates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('templates')}</h1>
          <p className="text-muted-foreground">
            Manage question templates for interviews
          </p>
        </div>
        <Button>
          <Link href="/templates/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            {t('createTemplate')}
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No templates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTemplate?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t('loading') : t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
