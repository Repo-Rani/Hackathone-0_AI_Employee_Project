'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BriefingRendererProps {
  content: string
}

export function BriefingRenderer({ content }: BriefingRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ node, ...props }) => {
          const text = React.Children.toArray(props.children).join('')
          let className = 'scroll-m-20 border-b pb-2 text-2xl font-bold tracking-tight'
          let icon = null

          if (text.includes('Revenue')) {
            className += ' text-success border-success'
            icon = <div className="size-5 text-success bg-success/10 rounded-full flex items-center justify-center mr-2">
              <Lightbulb className="size-3" />
            </div>
          } else if (text.includes('Bottlenecks')) {
            className += ' text-danger border-danger'
            icon = <div className="size-5 text-danger bg-danger/10 rounded-full flex items-center justify-center mr-2">
              <AlertTriangle className="size-3" />
            </div>
          } else if (text.includes('Completed Tasks')) {
            className += ' text-success border-success'
            icon = <div className="size-5 text-success bg-success/10 rounded-full flex items-center justify-center mr-2">
              <CheckCircle2 className="size-3" />
            </div>
          } else if (text.includes('Proactive Suggestions')) {
            className += ' text-warning border-warning'
            icon = <div className="size-5 text-warning bg-warning/10 rounded-full flex items-center justify-center mr-2">
              <Lightbulb className="size-3" />
            </div>
          }

          return (
            <h2 className={className}>
              <div className="flex items-center">
                {icon}
                {props.children}
              </div>
            </h2>
          )
        },
        h3: ({ node, ...props }) => (
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
            {props.children}
          </h3>
        ),
        table: ({ node, ...props }) => (
          <div className="my-4 overflow-auto">
            <Table>
              <TableHeader>
                {React.Children.map(props.children, (child: any) => {
                  if (child?.type?.displayName === 'TableHead') return child
                  if (Array.isArray(child?.props?.children)) {
                    return child.props.children.filter((c: any) => c?.type?.displayName === 'TableHead')
                  }
                  return null
                })}
              </TableHeader>
              <TableBody>
                {React.Children.map(props.children, (child: any) => {
                  if (child?.type?.displayName !== 'TableHead') return child
                  return null
                })}
              </TableBody>
            </Table>
          </div>
        ),
        thead: ({ node, ...props }) => <TableHeader {...props} />,
        tbody: ({ node, ...props }) => <TableBody {...props} />,
        tr: ({ node, ...props }) => {
          // Check if this is a bottleneck table row with delay > 2 days
          // We need to check the children to see if any contain delay information
          const isBottleneckTable = React.Children.toArray(props.children).some((child: any) => {
            if (React.isValidElement(child) && (child.props as any)?.children) {
              return React.Children.toArray((child.props as any).children).some((grandChild: any) => {
                return typeof grandChild === 'string' && (grandChild.includes('days') && parseInt(grandChild) > 2)
              })
            }
            return false;
          })

          const className = isBottleneckTable ? 'bg-danger/10' : ''
          return <TableRow className={className} {...props} />
        },
        th: ({ node, ...props }) => (
          <TableHead className="bg-background-3 text-foreground" {...props} />
        ),
        td: ({ node, ...props }) => (
          <TableCell className="py-3" {...props} />
        ),
        li: ({ node, ...props }) => {
          const children = React.Children.toArray(props.children)
          const firstChild = children[0]

          // Check if this is a task list item with checkbox
          if (typeof firstChild === 'string' && (firstChild.startsWith('[x]') || firstChild.startsWith('[ ]'))) {
            const isCompleted = firstChild.startsWith('[x]')
            const text = firstChild.substring(3) // Remove [x] or [ ] prefix

            return (
              <li className="flex items-start gap-2 mb-1">
                <div className="pt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : (
                    <div className="size-4 rounded-full border border-muted" />
                  )}
                </div>
                <span className={isCompleted ? 'text-success line-through' : 'text-foreground'}>
                  {text}
                  {children.slice(1)}
                </span>
              </li>
            )
          }

          // Check if this is a proactive suggestion
          // Extract text content from children to check for proactive suggestion pattern
          let textContent = '';
          React.Children.forEach(props.children, (child: any) => {
            if (typeof child === 'string') {
              textContent += child;
            } else if (React.isValidElement(child) && typeof (child.props as any).children === 'string') {
              textContent += (child.props as any).children;
            }
          });

          if (typeof textContent === 'string' && textContent.startsWith('[ ] **') && textContent.includes('suggest') && textContent.toLowerCase().includes('action')) {
            return (
              <li className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-2">
                <div className="flex items-start gap-2">
                  <div className="size-5 text-warning bg-warning/20 rounded-full flex items-center justify-center mt-0.5">
                    <Lightbulb className="size-3" />
                  </div>
                  <span className="flex-1">{props.children}</span>
                </div>
              </li>
            )
          }

          return <li className="mb-1" {...props} />
        },
        code: ({ node, ...props }: any) => {
          const { children, className, inline, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '')
          const isInline = inline || (typeof node !== 'undefined' && node?.type === 'text')

          if (isInline) {
            return (
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {children}
              </code>
            )
          }
          return (
            <pre className="relative my-4 overflow-auto rounded-lg bg-background-2 p-4 text-sm">
              <code className={match ? match[1] : ''} {...rest}>
                {children}
              </code>
            </pre>
          )
        },
        strong: ({ node, ...props }) => (
          <strong className="font-semibold" {...props} />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  )
}