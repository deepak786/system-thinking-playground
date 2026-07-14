import { AnimatePresence, motion } from 'framer-motion'
import { Ban, Check, Send, User } from 'lucide-react'
import type { ClientMeta } from '../data'
import type { RequestRecord } from '../types'
import { Card } from '../../../shared/Card'
import { Button } from '../../../shared/Button'
import { cn } from '../../../lib/cn'

type ClientCardProps = {
  client: ClientMeta
  history: RequestRecord[]
  blockedTotal: number
  onSend: () => void
}

/**
 * One user of the API: a send button plus the answers their recent requests
 * got back, styled as HTTP responses (green 200 = allowed, red 429 = blocked).
 */
export function ClientCard({ client, history, blockedTotal, onSend }: ClientCardProps) {
  return (
    <Card className="px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg ring-1',
            client.accentChip,
          )}
        >
          <User className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">{client.name}</p>
        {blockedTotal > 0 && (
          <span className="ml-auto rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-300 ring-1 ring-rose-500/40">
            {blockedTotal} blocked
          </span>
        )}
      </div>

      <Button
        variant="primary"
        icon={<Send className="h-4 w-4" />}
        onClick={onSend}
        className="w-full"
      >
        Send Request
      </Button>

      <div className="mt-3 flex min-h-[30px] flex-wrap gap-1.5">
        {history.length === 0 ? (
          <span className="text-[11px] text-slate-600">
            No requests sent yet
          </span>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((record) => {
              const allowed = record.outcome === 'allowed'
              return (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  title={
                    allowed
                      ? `Request #${record.id} allowed (200 OK)`
                      : `Request #${record.id} blocked (429 Too Many Requests)`
                  }
                  className="flex flex-col items-center gap-0.5"
                >
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold shadow-sm',
                      allowed
                        ? 'bg-emerald-500 text-emerald-950'
                        : 'bg-rose-500 text-white',
                    )}
                  >
                    {allowed ? (
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    ) : (
                      <Ban className="h-3 w-3" strokeWidth={3} />
                    )}
                    {allowed ? '200' : '429'}
                  </span>
                  <span className="font-mono text-[9px] leading-none text-slate-500">
                    #{record.id}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </Card>
  )
}
