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
import { ArrowDown, ArrowUp, Eye, RefreshCw, Trash2 } from 'lucide-react'
import type { URLClassification, URLScan } from '../../types'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import { Badge, classificationBadgeVariant } from '../common/Badge'
import { Modal } from '../common/Modal'
import { formatTimeAgo, truncateMiddle } from '../../utils/formatters'
import { cn } from '../../utils/cn'

function riskTone(score: number) {
  if (score >= 70) return 'text-primary'
  if (score >= 40) return 'text-warning'
  return 'text-success'
}

export function RecentURLScans({
  scans,
  onView,
  onRescan,
  onDelete,
  onClearAll,
}: {
  scans: URLScan[]
  onView: (scan: URLScan) => void
  onRescan: (url: string) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [classFilter, setClassFilter] = useState<URLClassification | 'all'>('all')
  const [confirmClear, setConfirmClear] = useState(false)

  const filteredData = useMemo(() => {
    return scans.filter((s) => classFilter === 'all' || s.classification === classFilter)
  }, [scans, classFilter])

  const columns = useMemo<ColumnDef<URLScan>[]>(
    () => [
      {
        accessorKey: 'url',
        header: 'URL',
        cell: (ctx) => (
          <span title={ctx.row.original.url} className="font-mono text-xs text-text">
            {truncateMiddle(ctx.row.original.url, 42)}
          </span>
        ),
      },
      {
        accessorKey: 'scannedAt',
        header: 'Scanned',
        cell: (ctx) => (
          <span className="text-muted">{formatTimeAgo(String(ctx.getValue()))}</span>
        ),
      },
      {
        accessorKey: 'riskScore',
        header: 'Risk',
        cell: (ctx) => {
          const v = Number(ctx.getValue())
          return (
            <span className={cn('font-semibold', riskTone(v))}>{v}%</span>
          )
        },
      },
      {
        accessorKey: 'classification',
        header: 'Classification',
        cell: (ctx) => (
          <Badge variant={classificationBadgeVariant(ctx.row.original.classification)}>
            {ctx.row.original.classification}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (ctx) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              aria-label="View report"
              onClick={() => onView(ctx.row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Re-scan"
              onClick={() => onRescan(ctx.row.original.url)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Delete"
              onClick={() => onDelete(ctx.row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onView, onRescan, onDelete],
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  return (
    <>
      <Card className="tt-noise">
        <CardHeader>
          <div>
            <CardTitle>Recent URL Scans</CardTitle>
            <div className="mt-1 text-xs text-muted">History · 20 per page</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value as URLClassification | 'all')}
              className="h-10 rounded-xl border-border/60 bg-panel2/70 px-2 text-sm text-text"
              aria-label="Filter by classification"
            >
              <option value="all">All classifications</option>
              <option value="safe">Safe</option>
              <option value="suspicious">Suspicious</option>
              <option value="malicious">Malicious</option>
              <option value="phishing">Phishing</option>
            </select>
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search URL…"
              className="h-10 w-44 rounded-xl border-border/60 bg-panel2/70 px-3 text-sm"
              aria-label="Search URL scans"
            />
            <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
              Clear history
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {scans.length === 0 ? (
            <div className="px-5 pb-4 text-sm text-muted">No URL scans yet.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                        {hg.headers.map((h) => (
                          <th
                            key={h.id}
                            className={cn(
                              'border-b border-border/60 bg-ink/45 px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.16em] text-muted',
                              h.column.getCanSort() ? 'cursor-pointer select-none' : '',
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
                          'transition-colors hover:bg-panel2/40',
                          idx % 2 === 0 ? 'bg-panel/20' : 'bg-panel2/15',
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="border-b border-border/30 px-4 py-3 text-sm"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Modal open={confirmClear} title="Clear all URL scan history?" onClose={() => setConfirmClear(false)}>
        <p className="text-sm text-muted">
          This removes all stored URL scans from local history. This cannot be undone.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="primary"
            onClick={() => {
              onClearAll()
              setConfirmClear(false)
            }}
          >
            Clear all
          </Button>
          <Button variant="secondary" onClick={() => setConfirmClear(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  )
}
