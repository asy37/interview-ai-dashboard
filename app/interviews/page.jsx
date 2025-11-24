'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import apiClient from '@/lib/api-client'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function InterviewsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ['interviews', positionFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (positionFilter) params.append('position', positionFilter)
      if (statusFilter) params.append('status', statusFilter)
      const response = await apiClient.get(`/interviews?${params}`)
      return response.data
    },
  })

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const response = await apiClient.get('/positions')
      return response.data
    },
  })

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      awaitingResponse: 'outline',
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {t(status)}
      </Badge>
    )
  }

  const getTypeBadge = (type) => {
    const colors = {
      video: 'bg-blue-100 text-blue-800',
      assessment: 'bg-green-100 text-green-800',
      combo: 'bg-purple-100 text-purple-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
        {t(type)}
      </span>
    )
  }

  const columns = [
    {
      accessorKey: 'candidateName',
      header: t('candidateName'),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('candidateName')}</div>
      ),
    },
    {
      accessorKey: 'position',
      header: t('position'),
    },
    {
      accessorKey: 'date',
      header: t('interviewDate'),
      cell: ({ row }) => format(new Date(row.getValue('date')), 'PPp'),
    },
    {
      accessorKey: 'type',
      header: t('interviewType'),
      cell: ({ row }) => getTypeBadge(row.getValue('type')),
    },
    {
      accessorKey: 'status',
      header: t('status'),
      cell: ({ row }) => getStatusBadge(row.getValue('status')),
    },
    {
      accessorKey: 'score',
      header: t('score'),
      cell: ({ row }) => {
        const score = row.getValue('score')
        return score ? (
          <span className="font-semibold text-primary">{score}%</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link href={`/interviews/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            {t('view')}
          </Button>
        </Link>
      ),
    },
  ]

  const table = useReactTable({
    data: interviews,
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
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('interviews')}</h1>
          <p className="text-muted-foreground">Manage and track all interviews</p>
        </div>
        <Button onClick={() => router.push('/interviews/create')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createInterview')}
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
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('position')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">{t('pending')}</SelectItem>
            <SelectItem value="completed">{t('completed')}</SelectItem>
            <SelectItem value="awaitingResponse">{t('awaitingResponse')}</SelectItem>
          </SelectContent>
        </Select>
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
                  No results.
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
    </div>
  )
}
