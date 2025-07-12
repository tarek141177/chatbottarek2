;(() => {
  // Get configuration from script tag
  const script = document.currentScript || document.querySelector("script[data-chat-agent-id]")
  const chatAgentId = script.getAttribute("data-chat-agent-id")
  const config = JSON.parse(script.getAttribute("data-config") || "{}")

  // Default configuration
  const defaultConfig = {
    primaryColor: "#3B82F6",
    secondaryColor: "#1F2937",
    position: "bottom-right",
    welcomeMessage: "Hi! How can I help you today?",
    placeholder: "Type your message...",
    apiUrl: script.src.replace("/widget.js", "/api/chat"),
  }

  const finalConfig = { ...defaultConfig, ...config }

  let isOpen = false
  let sessionId = null
  let chatContainer = null
  let messagesContainer = null
  let inputField = null

  // Create chat widget
  function createWidget() {
    // Chat button
    const chatButton = document.createElement("div")
    chatButton.id = "ai-chat-button"
    chatButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3.01 16.28L2 22L7.72 20.99C9.01 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.74 20 9.54 19.75 8.46 19.3L8 19.11L4.91 19.91L5.71 16.82L5.52 16.36C5.07 15.28 4.82 14.08 4.82 12.82C4.82 7.58 8.58 3.82 13.82 3.82C16.39 3.82 18.77 4.84 20.54 6.61C22.31 8.38 23.33 10.76 23.33 13.33C23.33 18.57 19.57 22.33 14.33 22.33H12V20Z" fill="white"/>
      </svg>
    `

    // Position the button
    const positions = {
      "bottom-right": { bottom: "20px", right: "20px" },
      "bottom-left": { bottom: "20px", left: "20px" },
      "top-right": { top: "20px", right: "20px" },
      "top-left": { top: "20px", left: "20px" },
    }

    const position = positions[finalConfig.position] || positions["bottom-right"]

    Object.assign(chatButton.style, {
      position: "fixed",
      width: "60px",
      height: "60px",
      backgroundColor: finalConfig.primaryColor,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: "9999",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      transition: "all 0.3s ease",
      ...position,
    })

    chatButton.addEventListener("click", toggleChat)
    chatButton.addEventListener("mouseenter", () => {
      chatButton.style.transform = "scale(1.1)"
    })
    chatButton.addEventListener("mouseleave", () => {
      chatButton.style.transform = "scale(1)"
    })

    // Chat container
    chatContainer = document.createElement("div")
    chatContainer.id = "ai-chat-container"
    chatContainer.style.display = "none"

    Object.assign(chatContainer.style, {
      position: "fixed",
      width: "350px",
      height: "500px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      zIndex: "9998",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: "hidden",
      ...getContainerPosition(position),
    })

    chatContainer.innerHTML = `
      <div style="background: ${finalConfig.primaryColor}; color: white; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Chat Support</h3>
        <button id="ai-chat-close" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">×</button>
      </div>
      <div id="ai-chat-messages" style="height: 380px; overflow-y: auto; padding: 16px; background: #f9fafb;"></div>
      <div style="padding: 16px; border-top: 1px solid #e5e7eb; background: white;">
        <div style="display: flex; gap: 8px;">
          <input id="ai-chat-input" type="text" placeholder="${finalConfig.placeholder}" style="flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; font-size: 14px;" />
          <button id="ai-chat-send" style="background: ${finalConfig.primaryColor}; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">Send</button>
        </div>
      </div>
    `

    messagesContainer = chatContainer.querySelector("#ai-chat-messages")
    inputField = chatContainer.querySelector("#ai-chat-input")

    // Event listeners
    chatContainer.querySelector("#ai-chat-close").addEventListener("click", toggleChat)
    chatContainer.querySelector("#ai-chat-send").addEventListener("click", sendMessage)
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage()
    })

    // Add to page
    document.body.appendChild(chatButton)
    document.body.appendChild(chatContainer)

    // Show welcome message
    addMessage(finalConfig.welcomeMessage, "assistant")
  }

  function getContainerPosition(buttonPosition) {
    const offset = 80 // Distance from button

    if (buttonPosition.bottom && buttonPosition.right) {
      return { bottom: offset + "px", right: "20px" }
    } else if (buttonPosition.bottom && buttonPosition.left) {
      return { bottom: offset + "px", left: "20px" }
    } else if (buttonPosition.top && buttonPosition.right) {
      return { top: offset + "px", right: "20px" }
    } else if (buttonPosition.top && buttonPosition.left) {
      return { top: offset + "px", left: "20px" }
    }

    return { bottom: "80px", right: "20px" }
  }

  function toggleChat() {
    isOpen = !isOpen
    chatContainer.style.display = isOpen ? "block" : "none"

    if (isOpen) {
      inputField.focus()
    }
  }

  function addMessage(content, role) {
    const messageDiv = document.createElement("div")
    messageDiv.style.marginBottom = "12px"

    const isUser = role === "user"
    messageDiv.innerHTML = `
      <div style="display: flex; justify-content: ${isUser ? "flex-end" : "flex-start"};">
        <div style="
          max-width: 80%; 
          padding: 8px 12px; 
          border-radius: 12px; 
          background: ${isUser ? finalConfig.primaryColor : "#e5e7eb"}; 
          color: ${isUser ? "white" : "#374151"};
          font-size: 14px;
          line-height: 1.4;
        ">
          ${content}
        </div>
      </div>
    `

    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function addTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.id = "typing-indicator"
    typingDiv.style.marginBottom = "12px"
    typingDiv.innerHTML = `
      <div style="display: flex; justify-content: flex-start;">
        <div style="
          padding: 8px 12px; 
          border-radius: 12px; 
          background: #e5e7eb; 
          color: #6b7280;
          font-size: 14px;
          font-style: italic;
        ">
          Typing...
        </div>
      </div>
    `

    messagesContainer.appendChild(typingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  async function sendMessage() {
    const message = inputField.value.trim()
    if (!message) return

    // Add user message
    addMessage(message, "user")
    inputField.value = ""

    // Show typing indicator
    addTypingIndicator()

    try {
      const response = await fetch(finalConfig.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          chatAgentId,
          sessionId,
        }),
      })

      const data = await response.json()

      removeTypingIndicator()

      if (response.ok) {
        addMessage(data.message, "assistant")
        sessionId = data.sessionId
      } else {
        addMessage("Sorry, I encountered an error. Please try again.", "assistant")
      }
    } catch (error) {
      removeTypingIndicator()
      addMessage("Sorry, I could not connect to the server. Please try again.", "assistant")
    }
  }

  // Initialize widget when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget)
  } else {
    createWidget()
  }
})()
