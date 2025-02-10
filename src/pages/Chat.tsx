
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Loader2, Upload, Mic, Send } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import ReactMarkdown from 'react-markdown'

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.full_name) {
        const firstName = session.user.user_metadata.full_name.split(' ')[0]
        setUserName(firstName)
      }
    }
    fetchUserName()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      // Get current user's ID
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          prompt: userMessage,
          userId: userId // Pass the user ID to provide context
        }
      })

      if (error) throw error

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.generatedText }
      ])
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-blue-600">
      <div className="container mx-auto px-4 py-8 max-w-3xl flex-1 flex flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Hi {userName}, how can I help you today?
          </h1>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-white placeholder:text-white/70 border-white/20"
            />
            <Button type="submit" variant="ghost" className="text-white" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="bg-white hover:bg-white/90 text-blue-600 p-6 h-auto flex flex-col items-center gap-2"
          >
            <Upload className="h-6 w-6" />
            <span className="font-semibold">Upload Exercise Video</span>
          </Button>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-white/90 text-blue-600 p-6 h-auto flex flex-col items-center gap-2"
          >
            <Mic className="h-6 w-6" />
            <span className="font-semibold">Record Voice Message</span>
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-white text-blue-600"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {message.role === "user" ? (
                    message.content
                  ) : (
                    <ReactMarkdown className="prose dark:prose-invert max-w-none prose-sm">
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-2xl flex items-center gap-2 text-white">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">NeuroPT is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
