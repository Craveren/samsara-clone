/**
 * Beautiful Area Chart Component
 * Enhanced with better gradients, colors, and styling
 */

'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { cn } from '@woodpecker/utils'

interface BeautifulAreaChartProps {
  data: any[]
  dataKey: string
  title: string
  description?: string
  icon?: string
  height?: number
  gradientId?: string
  strokeColor?: string
  showGrid?: boolean
  yAxisFormatter?: (value: number) => string
  tooltipFormatter?: (value: any, name: string) => [string, string]
  className?: string
}

export function BeautifulAreaChart({
  data,
  dataKey,
  title,
  description,
  icon = 'solar:chart-bold-duotone',
  height = 300,
  gradientId = 'beautifulGradient',
  strokeColor = '#000000',
  showGrid = true,
  yAxisFormatter,
  tooltipFormatter,
  className,
}: BeautifulAreaChartProps) {
  const defaultYAxisFormatter = React.useCallback((value: number) => {
    if (value >= 1000000) return `R${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `R${(value / 1000).toFixed(0)}k`
    return `R${value.toFixed(0)}`
  }, [])

  const formatter = yAxisFormatter || defaultYAxisFormatter

  // Calculate Y-axis domain for proper scaling
  const yAxisDomain = React.useMemo(() => {
    const values = data.map(d => d[dataKey]).filter(v => v != null && v > 0)
    if (values.length === 0) return [0, 1000]
    
    const max = Math.max(...values)
    const min = Math.min(...values)
    const padding = (max - min) * 0.15
    
    return [Math.max(0, min - padding * 0.5), max + padding]
  }, [data, dataKey])

  return (
    <Card className={cn("border border-border/60", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {icon && <Icon icon={icon} className="h-4 w-4" />}
          {title}
        </CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" style={{ minHeight: `${height}px`, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={height} minWidth={0}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.9}/>
                  <stop offset="50%" stopColor={strokeColor} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e5e5" 
                  opacity={0.2}
                  vertical={false}
                />
              )}
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#666', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#666', fontWeight: 500 }}
                tickFormatter={formatter}
                tickLine={false}
                axisLine={false}
                domain={yAxisDomain}
                width={60}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value
                    const formattedValue = tooltipFormatter 
                      ? tooltipFormatter(value, payload[0].name || '')
                      : [formatter(value as number), payload[0].name || '']
                    
                    return (
                      <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl backdrop-blur-sm">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {payload[0].payload.month || payload[0].payload.name}
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          {formattedValue[1]}: {formattedValue[0]}
                        </p>
                        {payload[0].payload.growth !== undefined && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Growth: {payload[0].payload.growth > 0 ? '+' : ''}{payload[0].payload.growth}%
                          </p>
                        )}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey}
                stroke={strokeColor} 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: strokeColor, strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

