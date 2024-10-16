fetch("data.json")
.then(function(response){
    return response.json();
})
.then(function(data){
    let placeholder = document.querySelector("#data-output");
    let out = "";
    for(let val of data){
        out += `
            <tr>
                <td>${val.question}</td>
                <td>${val.response}</td>
            </tr>
        `;
    }

    placeholder.innerHTML = out;
})

let chatHistory = [];

// Populate chat history list when the page loads
window.onload = function() {
    updateChatHistoryList();
};

document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("h1").style.display = "none";
    document.getElementById("p").style.display = "none";
    var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("searchInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("faqTable");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            // Get the corresponding answer and update the h1 tag
            var answer = tr[i].getElementsByTagName("td")[1].innerText;
          } else {
            tr[i].style.display = "none";
          }
        }
      }
      
    var userInput = document.getElementById("searchInput").value;
    if (userInput.trim() === "") {
        alert("Please enter a message.");
        return;
    }
    var chatBox = document.getElementById("chat-box");
    var messageElement = document.createElement("div");
    messageElement.innerText =("You:    " + "\n" + "\n" + userInput);
    messageElement.classList.add("message");
    messageElement.classList.add("user-message"); // Add user-message class
    chatBox.appendChild(messageElement);
    document.getElementById("searchInput").value = "";

    // AI-generated response
    var systemMessageElement = document.createElement("div");
    systemMessageElement.classList.add("message");
    systemMessageElement.classList.add("system-message"); // Add system-message class
    chatBox.appendChild(systemMessageElement);
    
    // Replace thinking dots with other text after 5 seconds
    setTimeout(function() {
        Think = ("Kamino.AI:    " + "\n" + "\n" + answer);
        systemMessageElement.innerText = Think;
    }, 3000);

    // Save chat history
    chatHistory.push({ userMessage: searchInput, systemMessage: response });

    updateChatHistoryList(); // Update chat history list
    }
  });
  
  const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");

let userText = null;
const API_KEY = "PASTE-YOUR-API-KEY-HERE"; // Paste your API key here

const loadDataFromLocalstorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
}

const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph element text
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if(!userText) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}


themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage 
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {   
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);
 chatHistory = [];

// Populate chat history list when the page loads
window.onload = function() {
    updateChatHistoryList();
};
function sendMessage() {
    document.getElementById("h1").style.display = "none";
    document.getElementById("p").style.display = "none";
    var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("searchInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("faqTable");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            // Get the corresponding answer and update the h1 tag
            var answer = tr[i].getElementsByTagName("td")[1].innerText;
          } else {
            tr[i].style.display = "none";
          }
        }
      }
      
    var userInput = document.getElementById("searchInput").value;
    if (userInput.trim() === "") {
        alert("Please enter a message.");
        return;
    }
    var chatBox = document.getElementById("chat-box");
    var messageElement = document.createElement("div");
    messageElement.innerText =("You:    " + "\n" + "\n" + userInput);
    messageElement.classList.add("message");
    messageElement.classList.add("user-message"); // Add user-message class
    chatBox.appendChild(messageElement);
    document.getElementById("searchInput").value = "";

    // AI-generated response
    var systemMessageElement = document.createElement("div");
    systemMessageElement.classList.add("message");
    systemMessageElement.classList.add("system-message"); // Add system-message class
    chatBox.appendChild(systemMessageElement);
    
    // Replace thinking dots with other text after 5 seconds
    setTimeout(function() {
        Think = ("Kamino.AI:    " + "\n" + "\n" + answer);
        systemMessageElement.innerText = Think;
    }, 3000);

    // Save chat history
    chatHistory.push({ userMessage: searchInput, systemMessage: response });

    updateChatHistoryList(); // Update chat history list
}

function updateChatHistoryList() {
    var chatHistoryList = document.getElementById("chat-history-list");
    chatHistoryList.innerHTML = "";
    chatHistory.forEach((chat, index) => {
        var listItem = document.createElement("li");
        var button = document.createElement("button");
        button.textContent = (chat + (index + 1));
        button.onclick = function() {
            loadChat(index);
        };
        listItem.appendChild(button);
        chatHistoryList.appendChild(listItem);
    });
}

function loadChat(index) {
    var chat = chatHistory[index];
    var chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    
    // Add user message
    var userMessageElement = document.createElement("div");
    userMessageElement.innerText = chat.userMessage;
    userMessageElement.classList.add("message");
    userMessageElement.classList.add("user-message");
    chatBox.appendChild(userMessageElement);
    
    // Add system message
    var systemMessageElement = document.createElement("div");
    systemMessageElement.innerText = chat.systemMessage;
    systemMessageElement.classList.add("message");
    systemMessageElement.classList.add("system-message");
    chatBox.appendChild(systemMessageElement);
}


function clearChat() {
    document.getElementById("h1").style.display = "inline";
    document.getElementById("p").style.display = "inline";
    var chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
}
  
document.getElementById("h1").style.display = "inline";
document.getElementById("p").style.display = "inline";
