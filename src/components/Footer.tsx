import React from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Sliders, Mic, Plus } from 'lucide-react'

export function Footer() {
  const { reportProgress, wordCount, characterCount, autoSave, setAutoSave, keywords, tags } = useAppContext()

  return (
    <footer className="border-t h-16 flex-shrink-0 bg-card text-card-foreground">
      <div className="h-full px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Sliders className="h-4 w-4 mr-2" />
            Score Report
          </Button>
          <span className="text-sm text-muted-foreground">Words: {wordCount} | Characters: {characterCount}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Report Progress:</span>
          <Progress value={reportProgress} className="w-64" />
          <span className="text-sm text-muted-foreground">{reportProgress}%</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 overflow-hidden max-w-[200px]">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Keywords:</span>
            <div className="flex items-center gap-1 overflow-hidden">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="whitespace-nowrap">{keyword}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 overflow-hidden max-w-[200px]">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Tags:</span>
            <div className="flex items-center gap-1 overflow-hidden">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="whitespace-nowrap">{tag}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">NONE</span>
              )}
            </div>
            <Button variant="outline" size="sm" className="flex-shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button variant="outline" size="sm">
              <Mic className="h-4 w-4 mr-2" />
              Voice Input
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
              <Label htmlFor="auto-save">Auto-save</Label>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
