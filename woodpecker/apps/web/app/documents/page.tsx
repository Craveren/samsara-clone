'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Separator } from '@woodpecker/ui'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { formatDate } from '@woodpecker/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Textarea } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@woodpecker/utils'

interface Document {
  id: string
  name: string
  category: 'legal' | 'financial' | 'personal' | 'medical' | 'other'
  size: number
  uploadedAt: string
  status: 'verified' | 'pending' | 'expired'
  url?: string
  description?: string
}

const categories = {
  legal: { label: 'Legal', icon: 'flat-color-icons:file' },
  financial: { label: 'Financial', icon: 'flat-color-icons:file' },
  personal: { label: 'Personal', icon: 'flat-color-icons:file' },
  medical: { label: 'Medical', icon: 'flat-color-icons:file' },
  other: { label: 'Other', icon: 'flat-color-icons:file' },
} as const

const defaultCategory = { label: 'Other', icon: 'flat-color-icons:file' }

export default function DocumentsPage() {
  const [mounted, setMounted] = React.useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false)
  const { toast } = useToast()
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const [documents, setDocuments] = useLocalStorage<Document[]>('woodpecker-documents', [
    {
      id: '1',
      name: 'Last Will & Testament',
      category: 'legal',
      size: 2457600,
      uploadedAt: '2024-01-15T10:30:00Z',
      status: 'verified',
      description: 'Primary will document with executor designation'
    },
    {
      id: '2',
      name: 'Birth Certificate',
      category: 'personal',
      size: 1228800,
      uploadedAt: '2024-01-10T14:20:00Z',
      status: 'verified',
    },
    {
      id: '3',
      name: 'Tax Returns 2023',
      category: 'financial',
      size: 3891200,
      uploadedAt: '2024-01-05T09:15:00Z',
      status: 'pending',
    },
    {
      id: '4',
      name: 'Passport',
      category: 'personal',
      size: 1536000,
      uploadedAt: '2023-12-20T16:45:00Z',
      status: 'verified',
    },
    {
      id: '5',
      name: 'Property Deed',
      category: 'legal',
      size: 4194304,
      uploadedAt: '2023-12-15T11:00:00Z',
      status: 'verified',
    },
  ])
  
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterCategory, setFilterCategory] = React.useState<string>('all')
  const [filterStatus, setFilterStatus] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list')
  const [uploadCategory, setUploadCategory] = React.useState<Document['category']>('other')
  const [uploadDescription, setUploadDescription] = React.useState('')

  const filteredDocuments = React.useMemo(() => {
    let filtered = documents

    if (filterCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === filterCategory)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === filterStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
  }, [documents, searchTerm, filterCategory, filterStatus])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const stats = React.useMemo(() => {
    const total = documents.length
    const verified = documents.filter(d => d.status === 'verified').length
    const totalSize = documents.reduce((sum, d) => sum + d.size, 0)
    const recent = documents.filter(d => {
      const daysSince = (Date.now() - new Date(d.uploadedAt).getTime()) / (1000 * 60 * 60 * 24)
      return daysSince <= 7
    }).length

    return { total, verified, totalSize, recent }
  }, [documents])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const newDoc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        category: uploadCategory,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'pending',
        url: reader.result as string,
        description: uploadDescription || undefined,
      }
      setDocuments(prev => [newDoc, ...prev])
      toast.success('Document Uploaded', `${file.name} has been uploaded successfully`)
      setIsUploadDialogOpen(false)
      setUploadCategory('other')
      setUploadDescription('')
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
    toast.success('Document Deleted', 'Document has been removed')
  }

  const handleView = (doc: Document) => {
    try {
      if (doc.url) {
        const newWindow = window.open(doc.url, '_blank', 'noopener,noreferrer')
        if (!newWindow) {
          toast.error('Popup Blocked', 'Please allow popups to view documents')
        }
      } else {
        toast.error('Document not available', 'This document does not have a file URL')
      }
    } catch (error) {
      console.error('View error:', error)
      toast.error('View Failed', 'Unable to open document. Please try again.')
    }
  }

  const handleDownload = (doc: Document) => {
    try {
      if (doc.url) {
        const a = document.createElement('a')
        a.href = doc.url
        a.download = doc.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success('Download Started', `${doc.name} is being downloaded`)
      } else {
        toast.error('Download Failed', 'This document does not have a file URL')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download Failed', 'Unable to download document. Please try again.')
    }
  }

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="h-10 w-10 border-3 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Document Vault
            </h1>
            <p className="text-muted-foreground">
              Store and manage all your estate planning documents. Upload, organize, and share important files securely.
            </p>
          </motion.div>
          
          <div className="mb-6 flex items-center justify-end">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all"
              onClick={() => setIsUploadDialogOpen(true)}
              data-intro="upload-document"
            >
              <Icon icon="solar:upload-bold-duotone" className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-border/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon="solar:folder-with-files-bold-duotone" className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total Documents</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border border-border/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon="solar:shield-check-bold-duotone" className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.verified}</div>
                  <div className="text-xs text-muted-foreground">Verified</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border border-border/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon="solar:database-bold-duotone" className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{formatFileSize(stats.totalSize)}</div>
                  <div className="text-xs text-muted-foreground">Total Size</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border border-border/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon="solar:clock-circle-bold-duotone" className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.recent}</div>
                  <div className="text-xs text-muted-foreground">Recent (7d)</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card className="border border-border mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Icon icon="flat-color-icons:search" className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(categories).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1 border border-border rounded-sm">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('list')}
                  >
                    <Icon icon="flat-color-icons:list" className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <Icon icon="flat-color-icons:grid" className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div data-intro="document-list">
            {filteredDocuments.length === 0 ? (
              <Card className="border border-border">
                <CardContent className="py-12 text-center">
                  <Icon icon="flat-color-icons:file" className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    {documents.length === 0
                      ? 'No documents yet'
                      : 'No documents match your filters'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {documents.length === 0 && 'Upload your first document to get started'}
                  </p>
                </CardContent>
              </Card>
            ) : viewMode === 'list' ? (
              <Card className="border border-border">
                <CardContent className="p-0">
                  <div className="divide-y divide-border/60">
                    <AnimatePresence>
                      {filteredDocuments.map((doc, idx) => {
                        const categoryInfo = categories[doc.category] || defaultCategory
                        return (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group hover:bg-muted/50 transition-all duration-200"
                          >
                            <div 
                              className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                              onClick={() => {
                                if (doc.url) {
                                  window.open(doc.url, '_blank')
                                }
                              }}
                            >
                              <div className="h-9 w-9 rounded-sm bg-muted flex items-center justify-center flex-shrink-0">
                                <Icon icon={categoryInfo.icon} className="h-4 w-4 text-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-medium text-foreground break-words">{doc.name}</p>
                                  <Badge variant={doc.status === 'verified' ? 'default' : 'secondary'} className="text-[10px]">
                                    {doc.status === 'verified' && <Icon icon="flat-color-icons:ok" className="h-2.5 w-2.5 mr-1" />}
                                    {doc.status === 'pending' && <Icon icon="flat-color-icons:clock" className="h-2.5 w-2.5 mr-1" />}
                                    {doc.status}
                                  </Badge>
                                </div>
                                <DescriptionList className="grid grid-cols-4 gap-x-4 gap-y-0.5">
                                  <div>
                                    <DescriptionTerm className="text-[10px]">Category</DescriptionTerm>
                                    <DescriptionDetails className="text-[10px]">{categoryInfo.label}</DescriptionDetails>
                                  </div>
                                  <div>
                                    <DescriptionTerm className="text-[10px]">Size</DescriptionTerm>
                                    <DescriptionDetails className="text-[10px]">{formatFileSize(doc.size)}</DescriptionDetails>
                                  </div>
                                  <div>
                                    <DescriptionTerm className="text-[10px]">Uploaded</DescriptionTerm>
                                    <DescriptionDetails className="text-[10px]">{formatDate(doc.uploadedAt, 'MMM d, yyyy')}</DescriptionDetails>
                                  </div>
                                  <div>
                                    <DescriptionTerm className="text-[10px]">Security</DescriptionTerm>
                                    <DescriptionDetails className="text-[10px] flex items-center gap-1">
                                      <Icon icon="flat-color-icons:lock" className="h-2.5 w-2.5" />
                                      Encrypted
                                    </DescriptionDetails>
                                  </div>
                                </DescriptionList>
                                {doc.description && (
                                  <p className="text-xs text-muted-foreground mt-1.5">{doc.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 hover:bg-foreground/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (doc.url) {
                                      window.open(doc.url, '_blank')
                                    } else {
                                      toast.success('Document Preview', 'Opening document viewer...')
                                    }
                                  }}
                                  title="Preview"
                                >
                                  <Icon icon="flat-color-icons:view-file" className="h-3.5 w-3.5 text-foreground" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 hover:bg-foreground/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDownload(doc)
                                  }}
                                  title="Download"
                                >
                                  <Icon icon="flat-color-icons:download" className="h-3.5 w-3.5 text-foreground" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(doc.id)
                                  }}
                                  title="Delete"
                                >
                                  <Icon icon="flat-color-icons:delete" className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredDocuments.map((doc, idx) => {
                    const categoryInfo = categories[doc.category] || defaultCategory
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="border border-border/60 hover:border-foreground/40 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center">
                                <Icon icon={categoryInfo.icon} className="h-5 w-5 text-foreground" />
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Icon icon="flat-color-icons:more" className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <CardTitle className="text-sm font-semibold mt-2">{doc.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <Badge variant={doc.status === 'verified' ? 'default' : 'secondary'} className="text-[10px]">
                                {doc.status}
                              </Badge>
                              <DescriptionList className="space-y-1">
                                <div>
                                  <DescriptionTerm className="text-[10px]">Category</DescriptionTerm>
                                  <DescriptionDetails className="text-[10px]">{categoryInfo.label}</DescriptionDetails>
                                </div>
                                <div>
                                  <DescriptionTerm className="text-[10px]">Size</DescriptionTerm>
                                  <DescriptionDetails className="text-[10px]">{formatFileSize(doc.size)}</DescriptionDetails>
                                </div>
                                <div>
                                  <DescriptionTerm className="text-[10px]">Uploaded</DescriptionTerm>
                                  <DescriptionDetails className="text-[10px]">{formatDate(doc.uploadedAt, 'MMM d, yyyy')}</DescriptionDetails>
                                </div>
                              </DescriptionList>
                              <div className="flex items-center gap-1 pt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1 text-xs h-7"
                                  onClick={() => handleView(doc)}
                                >
                                  <Icon icon="flat-color-icons:view-file" className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1 text-xs h-7"
                                  onClick={() => handleDownload(doc)}
                                >
                                  <Icon icon="flat-color-icons:download" className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document to your secure vault. Supported formats: PDF, DOC, DOCX, JPG, PNG
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={uploadCategory} 
                    onValueChange={(val) => setUploadCategory(val as Document['category'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add a description for this document..."
                    rows={3}
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  const fileInput = document.getElementById('file') as HTMLInputElement
                  if (fileInput?.files?.[0]) {
                    handleFileUpload({ target: fileInput } as React.ChangeEvent<HTMLInputElement>)
                  } else {
                    toast.error('No File Selected', 'Please select a file to upload')
                  }
                }}>
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
