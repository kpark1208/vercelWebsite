"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Eye, 
  Edit, 
  Upload, 
  RotateCcw, 
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered, 
  Quote,
  Heading1,
  Heading2,
  Link,
  Image,
  FileCode
} from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SimpleMarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your content...",
  label = "Content"
}: SimpleMarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetContent = () => {
    if (confirm("Are you sure you want to reset the content? This cannot be undone.")) {
      onChange("");
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload file
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const result = await response.json();
        
        // Insert the image markdown with the actual URL
        const imageMarkdown = `![${file.name}](${result.url})`;
        
        // Insert the image markdown at cursor position or append to content
        const newValue = value + (value.endsWith('\n') ? '' : '\n') + imageMarkdown + '\n';
        onChange(newValue);
        
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert 2 spaces
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        target.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
    
    // Set cursor position
    setTimeout(() => {
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      textarea.focus();
    }, 0);
  };

  const insertCodeBlock = () => {
    const codeBlock = '\n```javascript\n// Your code here\n```\n';
    const newValue = value + codeBlock;
    onChange(newValue);
  };

  return (
    <Card className={`${isFullscreen ? 'fixed inset-0 z-50 m-4' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{label}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2"
            >
              {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-2"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImageUpload}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Add Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetContent}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isPreview ? (
          <div className="bg-muted/30 p-6 min-h-[400px] overflow-y-auto">
            <MarkdownRenderer content={value} />
          </div>
        ) : (
          <>
            {/* Formatting Toolbar */}
            <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('**', '**')}
                className="h-8 px-2"
                title="Bold"
              >
                <Bold className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('*', '*')}
                className="h-8 px-2"
                title="Italic"
              >
                <Italic className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('`', '`')}
                className="h-8 px-2"
                title="Inline Code"
              >
                <Code className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={insertCodeBlock}
                className="h-8 px-2"
                title="Code Block"
              >
                <FileCode className="h-3 w-3" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('# ')}
                className="h-8 px-2"
                title="Heading 1"
              >
                <Heading1 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('## ')}
                className="h-8 px-2"
                title="Heading 2"
              >
                <Heading2 className="h-3 w-3" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('- ')}
                className="h-8 px-2"
                title="Unordered List"
              >
                <List className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('1. ')}
                className="h-8 px-2"
                title="Ordered List"
              >
                <ListOrdered className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('> ')}
                className="h-8 px-2"
                title="Quote"
              >
                <Quote className="h-3 w-3" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('[', '](url)')}
                className="h-8 px-2"
                title="Link"
              >
                <Link className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleImageUpload}
                className="h-8 px-2"
                title="Add Image"
              >
                <Image className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[400px] font-mono text-sm border-0 resize-none focus:ring-0 focus:border-0"
              style={{ 
                height: isFullscreen ? 'calc(100vh - 200px)' : '400px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}
            />
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </CardContent>
    </Card>
  );
} 