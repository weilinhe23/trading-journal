'use client'

import { useEffect, useRef } from 'react'
import MindElixir from 'mind-elixir'
import type { MindElixirData } from 'mind-elixir'
import 'mind-elixir/style.css'

interface MindMapEditorProps {
  initialData: MindElixirData
  onChange: (data: MindElixirData) => void
  readonly?: boolean
}

// Recursively find the node in the tree that contains targetId as a direct child
type NodeData = MindElixirData['nodeData']

function findParentNode(root: NodeData, targetId: string): NodeData | null {
  if (!root.children) return null
  for (const child of root.children) {
    if (child.id === targetId) return root
    const found = findParentNode(child, targetId)
    if (found) return found
  }
  return null
}

// After a child node is created, auto-create an explicit arrow link from parent → child
function autoLinkToParent(me: InstanceType<typeof MindElixir>, newNodeId: string) {
  requestAnimationFrame(() => {
    const data = me.getData()
    const parent = findParentNode(data.nodeData, newNodeId)
    if (!parent) return
    try {
      const fromEl = me.findEle(parent.id)
      const toEl = me.findEle(newNodeId)
      if (fromEl && toEl) {
        me.createArrow(fromEl, toEl)
      }
    } catch {
      // Arrow creation failed silently — node may not be in DOM yet
    }
  })
}

export function MindMapEditor({ initialData, onChange, readonly = false }: MindMapEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const meRef = useRef<InstanceType<typeof MindElixir> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const me = new MindElixir({
      el: containerRef.current,
      direction: MindElixir.SIDE,
      editable: !readonly,
      contextMenu: !readonly,
      toolBar: !readonly,
      keypress: !readonly,
      allowUndo: !readonly,
    })

    // Use provided data, or fallback to empty root
    const data: MindElixirData =
      initialData?.nodeData?.id
        ? initialData
        : ({ nodeData: { id: 'root', topic: '新策略', children: [] } } as MindElixirData)

    me.init(data)
    meRef.current = me

    if (!readonly) {
      me.bus.addListener('operation', (operation) => {
        // Auto-add arrow when a child node is added via Tab key or context menu
        if (operation.name === 'addChild') {
          autoLinkToParent(me, operation.obj.id)
        }
        // Auto-add arrow when a sibling is inserted via Enter key
        if (operation.name === 'insertSibling') {
          autoLinkToParent(me, operation.obj.id)
        }
        onChange(me.getData())
      })
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      meRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readonly])

  return (
    <div
      ref={containerRef}
      style={{ height: 'calc(100vh - 200px)', width: '100%' }}
      className="rounded-lg overflow-hidden border border-border"
    />
  )
}
