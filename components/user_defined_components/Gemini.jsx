// Import of React hooks and external libraries
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import constants from "expo-constants";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useInView } from 'react-intersection-observer';
import 'github-markdown-css';

export default function GeminiInReact()
{
    // [Get/Set] State management for various component features
    const [inputValue, setInputValue] = useState(''); // Stores current input field value
    const [promptResponses, setpromptResponses] = useState([]); // Stores all chat messages
    const [loading, setLoading] = useState(false); // Tracks loading state
    const [displayedResponses, setDisplayedResponses] = useState([]); // Stores currently visible messages
    const [page, setPage] = useState(1); // Current page number for infinite scrolling
    const itemsPerPage = 10; // Number of messages to load per page


    // Setup intersection observer for infinite scrolling
    const { ref, inView } = useInView({
        threshold: 0, // Trigger when element/s comes into view
    });


    // Initialize Google AI API
    const api_key = constants.expoConfig.extra.FRONTEND_API_KEY;
    const genAI = new GoogleGenerativeAI(api_key);


    // Initial setup effect - runs once when the component mounts to establish our AI Assistant.
    useEffect(() => {

        const initialSetup = async () => {
            try
            {
                setLoading(true);
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                // Define initial prompt to set up AI assistant's behavior
                const initialPrompt = "You are WILL-LM, a specialized AI coding assistant. Your primary focus is helping with programming and development tasks. " +
                    "You should provide clear, concise, and practical coding solutions. Always format your responses using Markdown syntax, " +
                    "including:\n\n- Using proper headings (##) for sections\n- Formatting code blocks with the appropriate language tags\n- " +
                    "Using bullet points or numbered lists for steps\n- Highlighting important terms with bold or italic text\n- " +
                    "Using tables when comparing options\n\nPlease confirm your understanding of this role with a well-formatted response.";

                // Generate initial response
                const result = await model.generateContent(initialPrompt);
                const response = result.response;
                const text = response.text();

                // Store initial response
                setpromptResponses([{
                    type: 'assistant',
                    content: text
                }]);
                setLoading(false);
            }
            catch (error)
            {
                console.log("Initial setup error:", error);
                setLoading(false);
            }
        };

        initialSetup();
    }, []);

    // Effect to update displayed responses when page or promptResponses change
    useEffect(() => {
        const endIndex = page * itemsPerPage;
        setDisplayedResponses(promptResponses.slice(0, endIndex));
    }, [page, promptResponses]);

    // Effect to handle infinite scrolling
    useEffect(() => {
        if (inView && !loading && displayedResponses.length < promptResponses.length)
        {
            setPage(prev => prev + 1);
        }
    }, [inView, loading]);

    // Handler for input field changes
    const handleInputChange = (e) =>
    {
        setInputValue(e.target.value);
    };

    // Handler for keyboard events (Enter key to send your message)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault();
            getResponseForGivenPrompt();
        }
    };

    // Function to get AI response for user input
    const getResponseForGivenPrompt = async () => {

        if (!inputValue.trim()) return;

        try
        {
            setLoading(true);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(inputValue);
            const response = result.response;
            const text = response.text();

            // Add both user input and AI response to chat history
            setpromptResponses([...promptResponses,
                { type: 'user', content: inputValue },
                { type: 'assistant', content: text }
            ]);
            setInputValue('');
            setLoading(false);
        }
        catch (error)
        {
            console.log("Error getting response:", error);
            setLoading(false);
        }
    };

    // Component render
    return (
        <div className="container">
            {/* Input section */}
            <div className="row">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ask Me Anything"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button
                        onClick={getResponseForGivenPrompt}
                        className="btn btn-outline-secondary"
                        type="button"
                        disabled={loading}
                        id="button-addon2">
                        Send
                    </button>
                </div>
            </div>

            {/* Chat display section */}
            <div className="conversation-container">
                {/* Loading spinner for the initial load */}
                {loading && displayedResponses.length === 0 ? (
                    <div className="text-center mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Analyzing..</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Message display */}
                        {displayedResponses.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                {message.type === 'user' ? (
                                    // User message display
                                    <div className="user-message">
                                        <strong>Nash:</strong>
                                        <p>{message.content}</p>
                                    </div>
                                ) : (
                                    // AI response display with Markdown formatting
                                    <div className="assistant-message markdown-body">
                                        <strong>WILL-LM:</strong>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                // Custom code block rendering in AI output response
                                                code({node, inline, className, children, ...props}) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline && match ? (
                                                        <div className="code-block-wrapper">
                                                            <div className="code-language">{match[1]}</div>
                                                            <pre className={className}>
                                                                <code className={className} {...props}>
                                                                    {children}
                                                                </code>
                                                            </pre>
                                                        </div>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Infinite scroll trigger element */}
                        <div ref={ref} style={{ height: '20px' }}>
                            {loading && displayedResponses.length > 0 && (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <style jsx>
            {`
                .conversation-container 
                {
                    max-height: 70vh;
                    overflow-y: auto;
                    padding: 1rem;
                }
                
                .message 
                {
                    margin-bottom: 1rem;
                }
                
                .user-message {
                    background-color: #f8f9fa;
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 0.5rem 0;
                }
                
                .assistant-message {
                    //background-color: #ffffff;
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 0.5rem 0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .code-block-wrapper {
                    position: relative;
                    margin: 1rem 0;
                }
                
                .code-language {
                    position: absolute;
                    right: 1rem;
                    top: 0.5rem;
                    font-size: 0.8rem;
                    color: #666;
                    //background-color: rgba(255,255,255,0.7);
                    padding: 0.2rem 0.5rem;
                    border-radius: 3px;
                }
                
                .markdown-body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                }
                
                .markdown-body pre {
                    //background-color: #f6f8fa;
                    padding: 1rem;
                    border-radius: 6px;
                }
                
                .markdown-body code {
                    background-color: rgba(27,31,35,0.05);
                    border-radius: 3px;
                    padding: 0.2em 0.4em;
                    font-size: 65%;
                }
            `}
            </style>
        </div>
    );
}