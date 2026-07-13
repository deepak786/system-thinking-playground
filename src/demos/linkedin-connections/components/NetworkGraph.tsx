import { motion } from 'framer-motion'
import {
  EDGES,
  edgeKey,
  degreeLabel,
  levelTheme,
  PEOPLE,
  personById,
} from '../data'
import type { PersonId, SearchState, SelectedPath } from '../types'
import { cn } from '../../../lib/cn'

type NetworkGraphProps = {
  state: SearchState
  selectedPath: SelectedPath
  onSelect: (id: PersonId | null) => void
}

const NODE_RADIUS = 27

/**
 * The friendship network. Gray lines are friendships; a line lights up in the
 * level color the moment it is used to FIND someone new. Click any discovered
 * person to trace the shortest chain of people back to You.
 */
export function NetworkGraph({ state, selectedPath, onSelect }: NetworkGraphProps) {
  const discoveredEdgeSet = new Set(state.discoveryEdges)

  return (
    <svg
      viewBox="0 0 760 560"
      className="block h-auto w-full"
      role="img"
      aria-label="Friendship network being explored by breadth-first search"
    >
      {/* Friendship lines */}
      {EDGES.map(([a, b]) => {
        const key = edgeKey(a, b)
        const pa = personById[a]
        const pb = personById[b]
        const onPath = selectedPath.edgeKeys.has(key)
        const isDiscovery = discoveredEdgeSet.has(key)
        // A discovery edge takes the color of the person it discovered
        // (whichever endpoint has the higher level).
        const da = state.degreeById[a]
        const db = state.degreeById[b]
        const childDegree =
          da !== undefined && db !== undefined ? Math.max(da, db) : undefined

        return (
          <g key={key}>
            <line
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              className="stroke-slate-700/70"
              strokeWidth={2}
            />
            {isDiscovery && childDegree !== undefined && (
              <motion.line
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={levelTheme(childDegree).stroke}
                strokeWidth={onPath ? 5 : 3}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: onPath ? 1 : 0.85 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            )}
            {onPath && (
              <motion.line
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                className="stroke-white/80"
                strokeWidth={2}
                strokeDasharray="6 8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </g>
        )
      })}

      {/* People */}
      {PEOPLE.map((person) => {
        const status = state.statusById[person.id] ?? 'unknown'
        const degree = state.degreeById[person.id]
        const discovered = degree !== undefined
        const theme = discovered ? levelTheme(degree) : null
        const isChecking = status === 'checking'
        const onPath = selectedPath.ids.includes(person.id)
        const isSelected = state.selectedId === person.id

        return (
          <g
            key={person.id}
            transform={`translate(${person.x}, ${person.y})`}
            className={cn(discovered && 'cursor-pointer')}
            onClick={() => {
              if (!discovered) return
              onSelect(isSelected ? null : person.id)
            }}
          >
            {/* Pulsing halo while this person's connections are checked */}
            {isChecking && (
              <motion.circle
                r={NODE_RADIUS + 6}
                className="fill-none stroke-white/60"
                strokeWidth={2}
                animate={{ scale: [1, 1.25, 1], opacity: [0.9, 0.2, 0.9] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            )}
            {isSelected && (
              <circle
                r={NODE_RADIUS + 5}
                className="fill-none stroke-white/70"
                strokeWidth={2}
                strokeDasharray="4 5"
              />
            )}

            <motion.circle
              r={NODE_RADIUS}
              className={cn(
                theme ? theme.node : 'fill-slate-800',
                theme ? theme.nodeRing : 'stroke-slate-600',
              )}
              strokeWidth={2}
              initial={false}
              animate={{ scale: discovered ? 1 : 0.9, opacity: onPath || !state.selectedId ? 1 : discovered ? 0.55 : 0.4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />

            {/* Initial (or ?) inside the circle */}
            <text
              textAnchor="middle"
              dominantBaseline="central"
              className={cn(
                'select-none text-lg font-bold',
                discovered ? 'fill-slate-950' : 'fill-slate-500',
              )}
            >
              {discovered ? person.name.charAt(0) : '?'}
            </text>

            {/* Name below */}
            <text
              y={NODE_RADIUS + 18}
              textAnchor="middle"
              className={cn(
                'select-none text-[13px] font-semibold',
                discovered ? 'fill-slate-200' : 'fill-slate-500',
              )}
            >
              {person.name}
            </text>

            {/* Level badge above, revealed on discovery */}
            {discovered && (
              <motion.g
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <rect
                  x={-21}
                  y={-NODE_RADIUS - 24}
                  width={42}
                  height={19}
                  rx={9.5}
                  className="fill-slate-900/90 stroke-slate-600"
                  strokeWidth={1}
                />
                <text
                  y={-NODE_RADIUS - 14}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn('select-none text-[11px] font-bold', theme?.text ?? '')}
                  style={{ fill: 'currentColor' }}
                >
                  {degreeLabel(degree)}
                </text>
              </motion.g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
