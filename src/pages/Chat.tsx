
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
          userId: userId
        }
      })

      if (error) throw error

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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl h-full flex flex-col">
        {messages.length === 0 && (
          <div className="text-center pt-4 mb-1">
            <h1 className="text-[28px] font-bold text-[#1A56DB] mb-0.5">
              How can I help you today?
            </h1>
            <p className="text-gray-600 text-base max-w-xl mx-auto">
              I'm your AI physiotherapy assistant. You can ask me questions, upload exercise videos, or record voice messages.
            </p>
          </div>
        )}

        <div className="flex-1 min-h-0 mb-1">
          <ScrollArea className="h-full px-2">
            <div className="space-y-2">
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
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
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
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl flex items-center gap-2 text-gray-900">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">NeuroPT is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-auto space-y-2 py-2 bg-white">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-10 text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm rounded-xl"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
            <Button 
              variant="outline" 
              className="h-10 text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm rounded-xl"
            >
              <Mic className="h-4 w-4 mr-2" />
              Record Voice
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 h-10 border border-gray-200 rounded-xl shadow-sm placeholder:text-gray-400"
            />
            <Button 
              type="submit" 
              size="icon"
              className="h-10 w-10 rounded-xl bg-[#1A56DB] hover:bg-[#1A56DB]/90 text-white shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
