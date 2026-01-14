'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

type Lesson = {
  id: string
  title: string
  content: string
  order: number
}

export function LessonViewer({
  lesson,
  moduleTitle,
}: {
  lesson: Lesson
  moduleTitle: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <div>
            <CardTitle className="text-xl">{lesson.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Module: {moduleTitle}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>,
              h4: ({ children }) => <h4 className="text-base font-semibold mb-2 mt-3">{children}</h4>,
              p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-outside mb-3 space-y-1 ml-6">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-outside mb-3 space-y-1 ml-6">{children}</ol>,
              li: ({ children, className }: any) => {
                const isTaskList = className?.includes('task-list-item')
                return (
                  <li className={`leading-relaxed ${isTaskList ? 'list-none ml-0' : ''}`}>
                    {children}
                  </li>
                )
              },
              input: ({ type, checked, ...props }: any) => {
                if (type === 'checkbox') {
                  return (
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled
                      className="mr-2 accent-primary"
                      {...props}
                    />
                  )
                }
                return <input type={type} {...props} />
              },
              code: ({ className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => (
                <pre className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto border border-border">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-border">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
              th: ({ children }) => (
                <th className="border border-border px-4 py-2 text-left font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-2">{children}</td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-primary underline hover:text-primary/80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {lesson.content || '*No content available*'}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}

