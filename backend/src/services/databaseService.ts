import { AbstractJavaScriptIndexCreationTask, AiAgentConfiguration, DocumentStore } from 'ravendb';

// Initialize the document store
const documentStore = new DocumentStore([
    process.env.RAVENDB_URL || 'http://127.0.0.1:8080'
], process.env.RAVENDB_DATABASE || 'Docs');

// Configure certificate if needed
if (process.env.RAVENDB_CERTIFICATE_PATH) {
    documentStore.authOptions = {
        certificate: process.env.RAVENDB_CERTIFICATE_PATH,
        type: "pfx"
    };
}

documentStore.initialize();

console.log('🗄️ RavenDB DocumentStore initialized');

// TODO: TEMP SHOULD NOT EXIST - should be provided by the ravendb package
export class Messages {
    content?: string;
    date?: Date;
    role?: string;
}

export class OpenActionCalls {
    // Add properties as needed
}

export class TotalUsage {
    CachedTokens?: number;
    CompletionTokens?: number;
    PromptTokens?: number;
    TotalTokens?: number;
}

export class Conversation {
    Agent?: string;
    HistoryDocuments?: any[];
    Messages?: Messages[];
    OpenActionCalls?: OpenActionCalls;
    Parameters?: Map<string, any>;
    TotalUsage?: TotalUsage;
}
// TODO: end

class Conversations_Search extends AbstractJavaScriptIndexCreationTask<Conversation> {
    constructor() {
        super();
        this.map("@conversations", (conv: any) => {
            return {
                userId: conv.Parameters.userId,
                lastModified: conv["@metadata"]["@last-modified"]
            };
        });

        this.store("lastModified", 'Yes');
    }
}

const agentConfig: AiAgentConfiguration = {
    identifier: 'ravendb-docs-rag-agent',
    name: 'RavenDB Docs RAG Agent',
    connectionStringName: 'Open AI Gen',
    systemPrompt: `
You are an AI assistant specialized in answering questions about RavenDB and how to work with it. 
You have access to a knowledge base of documents related to RavenDB, including its features, capabilities, and best practices.
Your task is to provide accurate and helpful responses to user queries based on the provided documents.
Answer in markdown format, using code blocks for any code examples.

Codeblocks should be formatted as follows:
\`\`\`language
<code>
\`\`\`
`,
    sampleObject: JSON.stringify({
        answer: 'Your answer here',
        sources: ['document ids of the documetation used to generate the answer']
    }),
    queries: [{
        name: 'SemanticSearchDocs',
        description: 'Semantic search of the knowledge base for relevant documents based on a query.',
        parametersSampleObject: JSON.stringify({
            query: 'The query to search for in the knowledge base'
        }),
        query: `
from "DocumentationPages" 
where vector.search(embedding.text(TextContent, ai.task('docs-embedding')), $query)
select Title, TextContent, Language, Category, id()
limit 5
`,
        parametersSchema: ''
    },
    {
        name: 'PreviousConversations',
        description: 'Retrieve previous conversations for the current user.',
        parametersSampleObject: JSON.stringify({
            query: 'Semantic search of the previous conversations for this user based on a query.'
        }),
        query: `
from "@conversations" as c
where vector.search(embedding.text(Messages, ai.task('chat-embedding')), $query)
limit 5
`,
        parametersSchema: ''
    }],
    persistence: {
        conversationIdPrefix: 'chats/',
        conversationExpirationInSec: 60 * 60 * 24 * 60, // 60 days
    },
    parameters: new Set(['userId', 'language']),
    outputSchema: '',
    actions: [],
    chatTrimming: null,
    maxModelIterationsPerCall: 16
};

// run in the background to create the agent configuration

new Conversations_Search().execute(documentStore)
    .then(() => {
        console.log('✅ Conversations_Search index created');
    })
    .catch(error => {
        console.error('❌ Failed to create Conversations_Search index:', error);
    });

documentStore.ai.createAgent(agentConfig)
    .then(() => {
        console.log('✅ AI Agent configuration created');
    })
    .catch(error => {
        console.error('❌ Failed to create AI Agent configuration:', error);
    });

export { documentStore };

