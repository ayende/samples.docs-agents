export interface Message {
  sender: 'user' | 'ai';
  text: string;
  language?: string;
  timestamp: Date;
}

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  createdAt: Date;
}

export class AiService {
  private conversations: Conversation[] = [];
  private nextConversationId = 1;

  constructor() {
    // Initialize with some sample conversations
    this.conversations = [
      {
        id: 1,
        name: 'C# Conversation',
        messages: [],
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Python Conversation',
        messages: [],
        createdAt: new Date()
      }
    ];
    this.nextConversationId = 3;
  }

  async generateResponse(userMessage: string, language: string, conversationId?: number): Promise<Message> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get language-specific dummy responses
    const responses = this.getDummyResponses(language);
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const aiResponse: Message = {
      sender: 'ai',
      text: randomResponse,
      language,
      timestamp: new Date()
    };

    // Store the conversation
    if (conversationId) {
      this.addMessageToConversation(conversationId, {
        sender: 'user',
        text: userMessage,
        timestamp: new Date()
      });
      this.addMessageToConversation(conversationId, aiResponse);
    }

    return aiResponse;
  }

  getConversations(): Conversation[] {
    return this.conversations;
  }

  createConversation(name: string): Conversation {
    const newConversation: Conversation = {
      id: this.nextConversationId++,
      name,
      messages: [],
      createdAt: new Date()
    };
    this.conversations.push(newConversation);
    return newConversation;
  }

  private addMessageToConversation(conversationId: number, message: Message): void {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages.push(message);
    }
  }

  private getDummyResponses(language: string): string[] {
    const baseResponses = {
      csharp: [
        `Here's a C# example that should help:

\`\`\`csharp
public class Example
{
    public void Method()
    {
        Console.WriteLine("Hello from C#!");
    }
}
\`\`\`

This demonstrates basic C# syntax and structure.`,
        `For C# development, consider this approach:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class DataProcessor
{
    private List<string> data = new List<string>();
    
    public void ProcessData(string input)
    {
        data.Add(input.ToUpper());
    }
}
\`\`\`

This shows proper C# naming conventions and basic collection usage.`
      ],
      python: [
        `Here's a Python solution:

\`\`\`python
def example_function():
    """This is a sample Python function."""
    result = []
    for i in range(10):
        result.append(i * 2)
    return result

# Usage
output = example_function()
print(output)
\`\`\`

This demonstrates Python's clean syntax and list comprehensions.`,
        `For Python development, try this pattern:

\`\`\`python
class DataProcessor:
    def __init__(self):
        self.data = []
    
    def process_data(self, input_data):
        processed = [item.upper() for item in input_data]
        self.data.extend(processed)
        return processed
\`\`\`

This shows Python's object-oriented approach and list comprehensions.`
      ],
      javascript: [
        `Here's a Node.js example:

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/api/data', (req, res) => {
    const data = {
        message: 'Hello from Node.js!',
        timestamp: new Date().toISOString()
    };
    res.json(data);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
\`\`\`

This demonstrates a basic Express.js server setup.`,
        `For Node.js development, consider this async pattern:

\`\`\`javascript
async function processData(input) {
    try {
        const result = await fetch('https://api.example.com/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: input })
        });
        
        return await result.json();
    } catch (error) {
        console.error('Error processing data:', error);
        throw error;
    }
}
\`\`\`

This shows modern async/await syntax for handling asynchronous operations.`
      ]
    };

    return baseResponses[language as keyof typeof baseResponses] || [
      `Here's a general programming example that might help with your question about ${language}.`
    ];
  }
}
