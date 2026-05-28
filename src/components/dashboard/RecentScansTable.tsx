import { useMemo, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, Download, Eye, Trash2 } from 'lucide-react'
import type { ScanRecord } from '../../types'
import { formatDateTime } from '../../utils/formatters'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { RiskGauge } from './RiskGauge'
import { cn } from '../../utils/cn'
import { useNotification } from '../../hooks/useNotification'
import { useNavigate } from 'react-router-dom'

function badgeVariant(status: ScanRecord['status']) {
  if (status === 'Critical') return 'critical'
  if (status === 'Safe') return 'safe'
  return 'pending'
}

export function RecentScansTable({ data }: { data: ScanRecord[] }) {
  const nav = useNavigate()
  const notify = useNotification()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<ScanRecord>[]>(
    () => [
      { accessorKey: 'fileName', header: 'File name' },
      {
        accessorKey: 'scanDate',
        header: 'Scan date',
        cell: (ctx) => formatDateTime(String(ctx.getValue())),
      },
      {
        accessorKey: 'riskScore',
        header: 'Risk',
        cell: (ctx) => (
          <div className="flex items-center gap-3">
            <RiskGauge value={Number(ctx.getValue())} size={56} stroke={7} />
            <div className="text-xs text-muted">0–100</div>
          </div>
        ),
      },
      { accessorKey: 'malwareFamily', header: 'Family' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (ctx) => (
          <Badge variant={badgeVariant(ctx.row.original.status)}>
            {ctx.row.original.status}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (ctx) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label="View report"
              onClick={() => nav(`/analysis/${ctx.row.original.id}`)}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Export"
              onClick={() =>
                notify.info('Export stub', 'PDF/JSON export integrates later.')
              }
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Delete"
              onClick={() => notify.warning('Delete stub', 'Connect to API later.')}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ),
      },
    ],
    [nav, notify],
  )

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <Card className="tt-noise">
      <CardHeader>
        <div>
          <CardTitle>Recent Scans</CardTitle>
          <div className="mt-1 text-xs text-muted">
            Sorting, filtering, pagination enabled
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Filter…"
            className="h-10 w-48 rounded-xl border-border/60 bg-panel2/70 px-3 text-sm text-text placeholder:text-muted/60 focus:border-cyan/70 focus:ring-cyan/40"
            aria-label="Filter recent scans"
          />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className={cn(
                        'sticky top-0 border-b border-border/60 bg-ink/45 px-4 py-3 text-left text-xs font-bold tracking-[0.18em] uppercase text-muted',
                        h.column.getCanSort()
                          ? 'cursor-pointer select-none hover:text-text'
                          : '',
                      )}
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5 text-cyan" />
                        ) : h.column.getIsSorted() === 'desc' ? (
                          <ArrowDown className="h-3.5 w-3.5 text-cyan" />
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={cn(
                    'transition-colors',
                    idx % 2 === 0 ? 'bg-panel/25' : 'bg-panel2/20',
                    'hover:bg-panel2/40',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b border-border/30 px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="text-sm text-muted">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

