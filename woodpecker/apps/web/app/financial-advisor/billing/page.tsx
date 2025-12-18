'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { formatDate } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'

interface Invoice {
  id: string
  clientName: string
  clientId: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'draft'
  dueDate: string
  invoiceDate: string
  description: string
  planType?: string
}

export default function FinancialAdvisorBillingPage() {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('financial-advisor-invoices', [
    {
      id: '1',
      clientName: 'John Smith',
      clientId: '1',
      amount: 2500,
      status: 'paid',
      dueDate: '2024-01-15',
      invoiceDate: '2024-01-01',
      description: 'Monthly Financial Planning Fee - January 2024',
      planType: 'Premium Plan',
    },
    {
      id: '2',
      clientName: 'Sarah Williams',
      clientId: '2',
      amount: 1500,
      status: 'pending',
      dueDate: '2024-02-01',
      invoiceDate: '2024-01-15',
      description: 'Monthly Financial Planning Fee - February 2024',
      planType: 'Standard Plan',
    },
    {
      id: '3',
      clientName: 'Michael Brown',
      clientId: '3',
      amount: 4500,
      status: 'overdue',
      dueDate: '2024-01-10',
      invoiceDate: '2023-12-15',
      description: 'Monthly Financial Planning Fee - January 2024',
      planType: 'Premium Plus Plan',
    },
  ])

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
  const totalInvoices = invoices.length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-foreground/5 text-foreground border-border/60"><Icon icon="solar:check-circle-bold" className="h-3 w-3 mr-1" />Paid</Badge>
      case 'pending':
        return <Badge variant="outline" className="border-amber-200 text-amber-700"><Icon icon="solar:clock-circle-bold" className="h-3 w-3 mr-1" />Pending</Badge>
      case 'overdue':
        return <Badge variant="outline" className="border-red-500 text-red-600"><Icon icon="solar:danger-triangle-bold" className="h-3 w-3 mr-1" />Overdue</Badge>
      case 'draft':
        return <Badge variant="outline"><Icon icon="solar:document-text-bold" className="h-3 w-3 mr-1" />Draft</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Billing & Invoicing
                </h1>
                <p className="text-muted-foreground">
                  Manage client invoices, payments, and billing cycles
                </p>
              </div>
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                <Icon icon="solar:add-circle-bold-duotone" className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">
                        R{totalRevenue.toLocaleString('en-ZA')}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:wallet-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pending</p>
                      <p className="text-2xl font-bold text-foreground">
                        R{pendingAmount.toLocaleString('en-ZA')}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:clock-circle-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Overdue</p>
                      <p className="text-2xl font-bold text-foreground">
                        R{overdueAmount.toLocaleString('en-ZA')}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:danger-triangle-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Invoices</p>
                      <p className="text-2xl font-bold text-foreground">{totalInvoices}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:document-text-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Invoices Table */}
          <Card className="border border-border/40">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>All invoices and billing records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Icon icon="solar:document-text-bold-duotone" className="h-6 w-6 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-foreground">
                            {invoice.clientName}
                          </p>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{invoice.description}</p>
                        {invoice.planType && (
                          <Badge variant="outline" className="text-[10px] mt-1">
                            {invoice.planType}
                          </Badge>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Invoice #{invoice.id}</span>
                          <span>•</span>
                          <span>Due: {formatDate(invoice.dueDate, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">
                          R{invoice.amount.toLocaleString('en-ZA')}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon icon="solar:download-bold-duotone" className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

