import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send } from 'lucide-react'

interface AIAssistantProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AIAssistant = ({ open, onOpenChange }: AIAssistantProps) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hi! Ask me about sales, inventory, or trends.' }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const send = async () => {
    if (!input.trim() || sending) return
    const userMsg = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: userMsg }])
    setSending(true)
    try {
      // Placeholder response. Hook up to your AI later.
      const fauxAnswer = "I'm not connected to an AI provider yet. Connect Supabase functions or an AI key to enable smart insights."
      await new Promise((r) => setTimeout(r, 500))
      setMessages((m) => [...m, { role: 'assistant', content: fauxAnswer }])
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
          <DialogDescription>Natural language insights for your POS data</DialogDescription>
        </DialogHeader>
        <Card className="p-4 h-72 overflow-y-auto space-y-3 bg-card/60">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'assistant' ? 'text-sm text-muted-foreground' : 'text-sm font-medium'}>
              {m.content}
            </div>
          ))}
        </Card>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Which items are low stock today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <Button onClick={send} disabled={sending} className="gap-2">
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AIAssistant
