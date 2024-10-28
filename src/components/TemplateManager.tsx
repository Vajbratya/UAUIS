import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Badge } from './ui/badge'
import { Search, Star, Clock, ChevronRight, Plus, Wand2 } from 'lucide-react'
import { Template, DynamicField, TemplateSection, Modality } from '../utils/types'
import { defaultTemplates } from '../utils/templates'
import { generateClaudeResponse } from '../utils/claudeApi'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { cn } from '../lib/utils'
import { useToast } from './ui/use-toast'

interface TemplateManagerProps {
  isOpen: boolean
  onClose: () => void
  onInsertTemplate: (content: string) => void
}

interface NewTemplateState extends Partial<Template> {
  tags?: string[]
}

const STORAGE_KEY = 'templateDynamicValues'

export default function TemplateManager({
  isOpen,
  onClose,
  onInsertTemplate
}: TemplateManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedModality, setSelectedModality] = useState<Modality>(Modality.CT)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({})
  const [userTemplates, setUserTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem('userTemplates')
    return saved ? JSON.parse(saved) : []
  })
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [isGeneratingAITemplate, setIsGeneratingAITemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState<NewTemplateState>({
    modality: Modality.CT,
    type: 'normal',
    sections: [],
    tags: []
  })
  const [aiPrompt, setAiPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [previewContent, setPreviewContent] = useState<string>('')
  const { toast } = useToast()

  useEffect(() => {
    if (selectedTemplate) {
      const savedValues = localStorage.getItem(`${STORAGE_KEY}-${selectedTemplate.id}`)
      if (savedValues) {
        setDynamicValues(JSON.parse(savedValues))
      }
    }
  }, [selectedTemplate])

  useEffect(() => {
    if (selectedTemplate && Object.keys(dynamicValues).length > 0) {
      localStorage.setItem(
        `${STORAGE_KEY}-${selectedTemplate.id}`,
        JSON.stringify(dynamicValues)
      )
    }
  }, [dynamicValues, selectedTemplate])

  const allTemplates = [...defaultTemplates, ...userTemplates]

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesModality = selectedModality === template.modality
      
      return matchesSearch && matchesModality
    })
  }, [searchQuery, selectedModality, allTemplates])

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    const savedValues = localStorage.getItem(`${STORAGE_KEY}-${template.id}`)
    const initialValues: Record<string, any> = savedValues 
      ? JSON.parse(savedValues)
      : {}
    
    template.sections.forEach(section => {
      section.dynamicFields?.forEach(field => {
        if (!(field.id in initialValues)) {
          initialValues[field.id] = field.defaultValue
        }
      })
    })
    
    setDynamicValues(initialValues)
  }

  const handleDynamicFieldChange = (fieldId: string, value: any) => {
    setDynamicValues(prev => {
      const updated = {
        ...prev,
        [fieldId]: value
      }
      if (selectedTemplate) {
        localStorage.setItem(
          `${STORAGE_KEY}-${selectedTemplate.id}`,
          JSON.stringify(updated)
        )
      }
      return updated
    })
  }

  const processTemplate = (template: Template): string => {
    let result = ''
    
    // Add header with template info
    result += `${template.name}\n`
    result += `${'-'.repeat(template.name.length)}\n\n`
    
    // Process each section
    template.sections.forEach(section => {
      if (!section.isOptional || dynamicValues[`section_${section.id}_enabled`]) {
        let sectionContent = section.content

        // Replace dynamic field placeholders
        section.dynamicFields?.forEach(field => {
          const value = dynamicValues[field.id]
          if (value !== undefined) {
            const placeholder = `{${field.name}}`
            const displayValue = field.type === 'measurement' 
              ? `${value}${field.unit || ''}`
              : value.toString()
            sectionContent = sectionContent.replace(placeholder, displayValue)
          }
        })

        result += `${section.title}:\n${sectionContent}\n\n`
      }
    })

    return result.trim()
  }

  const handleInsert = () => {
    if (selectedTemplate) {
      const processedContent = processTemplate(selectedTemplate)
      onInsertTemplate(processedContent)
      onClose()
    }
  }

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description || !newTemplate.bodyPart) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const template: Template = {
      id: `user-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      modality: newTemplate.modality as Modality,
      bodyPart: newTemplate.bodyPart,
      type: newTemplate.type as 'normal' | 'findings' | 'emergency',
      sections: newTemplate.sections as TemplateSection[],
      tags: newTemplate.tags || []
    }

    setUserTemplates(prev => {
      const updated = [...prev, template]
      localStorage.setItem('userTemplates', JSON.stringify(updated))
      return updated
    })

    setIsCreatingTemplate(false)
    setNewTemplate({
      modality: Modality.CT,
      type: 'normal',
      sections: [],
      tags: []
    })
  }

  const handleGenerateAITemplate = async () => {
    if (!aiPrompt) {
      toast({
        title: "Error",
        description: "Please provide a description for the template",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await generateClaudeResponse(aiPrompt, 'Generate Report')
      if (!response) {
        throw new Error('No response from Claude API')
      }

      const sections = response.split('\n\n').map((section, index) => {
        const lines = section.split('\n')
        const title = lines[0]
        const content = lines.slice(1).join('\n')
        return {
          id: `section-${index}`,
          title: title.replace(':', '').trim(),
          content: content.trim(),
          isOptional: false
        }
      })

      setNewTemplate(prev => ({
        ...prev,
        sections,
        name: `Template AI - ${new Date().toLocaleDateString()}`,
        description: aiPrompt
      }))

      setIsCreatingTemplate(true)
      setIsGeneratingAITemplate(false)
    } catch (error) {
      console.error('Erro ao gerar template:', error)
      alert('Erro ao gerar template. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagsChange = (value: string) => {
    setNewTemplate(prev => ({
      ...prev,
      tags: value.split(',').map(tag => tag.trim()).filter(Boolean)
    }))
  }

  const groupedTemplates = useMemo(() => {
    return filteredTemplates.reduce((acc, template) => {
      if (!acc[template.bodyPart]) {
        acc[template.bodyPart] = []
      }
      acc[template.bodyPart].push(template)
      return acc
    }, {} as Record<string, Template[]>)
  }, [filteredTemplates])

  const handlePreview = useCallback(async () => {
    if (!selectedTemplate) return
    
    const processedContent = processTemplate(selectedTemplate)
    try {
      const preview = await generateClaudeResponse(processedContent, "Enhance Report")
      setPreviewContent(preview)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive"
      })
    }
  }, [selectedTemplate, dynamicValues, toast])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Template Manager</DialogTitle>
          <DialogDescription>
            Select or create a template for your report
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 gap-4 mt-4 min-h-0">
          <div className="w-1/3 flex flex-col min-h-0">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <Tabs value={selectedModality} onValueChange={(v) => setSelectedModality(v as Modality)}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value={Modality.CT}>CT</TabsTrigger>
                  <TabsTrigger value={Modality.MRI}>MRI</TabsTrigger>
                  <TabsTrigger value={Modality.XR}>XR</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsGeneratingAITemplate(true)}
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  AI Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingTemplate(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              {Object.entries(groupedTemplates).map(([bodyPart, templates]) => (
                <div key={bodyPart} className="mb-4">
                  <h3 className="font-semibold mb-2">{bodyPart}</h3>
                  <div className="space-y-2">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className={`p-2 rounded-md cursor-pointer hover:bg-accent ${
                          selectedTemplate?.id === template.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{template.name}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {template.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="flex-1 border-l pl-4 min-h-0 flex flex-col">
            {isCreatingTemplate ? (
              <div className="h-full flex flex-col overflow-hidden">
                <h2 className="text-lg font-semibold mb-4">New Template</h2>
                <ScrollArea className="flex-1">
                  <div className="space-y-4 pr-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newTemplate.name || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newTemplate.description || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Modality</Label>
                      <Select
                        value={newTemplate.modality}
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, modality: value as Modality }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Modality.CT}>CT</SelectItem>
                          <SelectItem value={Modality.MRI}>MRI</SelectItem>
                          <SelectItem value={Modality.XR}>XR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Body Part</Label>
                      <Input
                        value={newTemplate.bodyPart || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, bodyPart: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Tags (comma separated)</Label>
                      <Input
                        value={newTemplate.tags?.join(', ') || ''}
                        onChange={(e) => handleTagsChange(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={newTemplate.type}
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value as 'normal' | 'findings' | 'emergency' }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="findings">Findings</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newTemplate.sections?.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <Label>Section {index + 1}</Label>
                        <Input
                          placeholder="Title"
                          value={section.title}
                          onChange={(e) => {
                            const updatedSections = [...(newTemplate.sections || [])]
                            updatedSections[index] = { ...section, title: e.target.value }
                            setNewTemplate(prev => ({ ...prev, sections: updatedSections }))
                          }}
                        />
                        <Textarea
                          placeholder="Content"
                          value={section.content}
                          onChange={(e) => {
                            const updatedSections = [...(newTemplate.sections || [])]
                            updatedSections[index] = { ...section, content: e.target.value }
                            setNewTemplate(prev => ({ ...prev, sections: updatedSections }))
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const newSection: TemplateSection = {
                          id: `section-${Date.now()}`,
                          title: '',
                          content: '',
                          isOptional: false
                        }
                        setNewTemplate(prev => ({
                          ...prev,
                          sections: [...(prev.sections || []), newSection]
                        }))
                      }}
                    >
                      Add Section
                    </Button>
                  </div>
                </ScrollArea>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsCreatingTemplate(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Save Template
                  </Button>
                </div>
              </div>
            ) : isGeneratingAITemplate ? (
              <div className="h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4">AI Template Generator</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Describe the template you want to create</Label>
                    <Textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ex: Template for normal chest CT, including sections for technique, lungs, mediastinum and pleura..."
                      className="h-32"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsGeneratingAITemplate(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerateAITemplate} disabled={isLoading}>
                      {isLoading ? 'Generating...' : 'Generate Template'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : selectedTemplate ? (
              <div className="h-full flex flex-col overflow-hidden">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">{selectedTemplate.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                {selectedTemplate.sections.some(s => s.dynamicFields?.length) && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Dynamic Fields</h3>
                    <div className="space-y-2">
                      {selectedTemplate.sections.flatMap(section => 
                        section.dynamicFields?.map(field => (
                          <div key={field.id} className="flex items-center gap-2">
                            <label className="text-sm">{field.name}:</label>
                            {field.type === 'select' ? (
                              <select
                                value={dynamicValues[field.id]}
                                onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {field.options?.map(option => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === 'measurement' ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={dynamicValues[field.id]}
                                  onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                                  className="w-24"
                                />
                                <span className="text-sm">{field.unit}</span>
                              </div>
                            ) : field.type === 'boolean' ? (
                              <input
                                type="checkbox"
                                checked={dynamicValues[field.id]}
                                onChange={(e) => handleDynamicFieldChange(field.id, e.target.checked)}
                              />
                            ) : (
                              <Input
                                value={dynamicValues[field.id]}
                                onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                              />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                <ScrollArea className="flex-1">
                  <div className="space-y-4 pr-4">
                    {selectedTemplate.sections.map(section => (
                      <div key={section.id}>
                        <h3 className="font-semibold mb-2">{section.title}</h3>
                        <p className="whitespace-pre-wrap">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleInsert}>
                    Insert Template
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a template to view
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
