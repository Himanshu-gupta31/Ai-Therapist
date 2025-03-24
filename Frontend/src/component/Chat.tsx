"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"

const Chat: React.FC = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    setMessages((prev) => [...prev, `You:${input}`])
    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:8000/api/v1/chat/chat", {
        message: input,
      })
      console.log(response)
      const reply = response.data.response
      setMessages((prev) => [...prev, `Bot:${reply}`])
    } catch (error) {
      console.error("Error sending message", error)
      setMessages((prev) => [...prev, "Bot: Error! Try again."])
    } finally {
      setIsLoading(false)
    }
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 p-0 border rounded-xl shadow-lg overflow-hidden bg-white">
      {/* Header - Changed to yellow theme */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-4">
        <h1 className="text-xl mb-0 font-bold text-center text-white">Chat Assistant</h1>
      </div>

      {/* Messages Container */}
      <div className="mb-0 h-80 overflow-y-auto p-4 bg-yellow-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-amber-600">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.startsWith("You:")
            const content = msg.substring(msg.indexOf(":") + 1)

            return (
              <div key={index} className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`relative max-w-[80%] px-4 py-3 rounded-lg ${
                    isUser
                      ? "bg-amber-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-amber-200"
                  }`}
                >
                  <p className="break-words">{content}</p>

                  {/* Chat bubble triangle */}
                  {/* <div
                    className={`absolute bottom-0 w-3 h-3 ${
                      isUser
                        ? "right-0 translate-x-1/3 translate-y-1/3 bg-amber-500"
                        : "left-0 -translate-x-1/3 translate-y-1/3 bg-white border-b border-r border-amber-200"
                    } transform rotate-45`}
                  ></div> */}
                </div>
              </div>
            )
          })
        )}

        {/* Loading indicator - Updated to yellow theme */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-amber-200 rounded-lg p-3 flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - Updated to yellow theme */}
      <div className="flex p-4 border-t border-amber-200 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-amber-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent px-4"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={`ml-2 px-4 py-2 rounded-full flex items-center justify-center ${
            isLoading || !input.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
          } transition-colors`}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default Chat

