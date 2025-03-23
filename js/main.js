const chatInput = document.querySelector(".chat-input textarea")
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
let userMessage;
const apiKey = "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"; // Replace with your API key
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    // let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">Smart_toy</span><p>${message}</p>`;

    // displaying in plain text format(without html)
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">Smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    // if(incomingChatLi === "Hello"){
    //     chatbox.appendChild(createChatLi('you are welcome '+incomingChatLi, "incoming"));
    // }else{
    //     chatbox.appendChild(createChatLi('Hello!, How can I assist you today?', "incoming"));
    // }

    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Use "gpt-4" if you have access
            messages: [{ role: "user", content: userMessage }],
        })
    };

    // send post request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        console.log(data);
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        console.log(error);
        messageElement.textContent = "Oops!. Something went wrong. Please try Again.";
        // messageElement.textContent = "Hello!, How can I assist you today?";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));

}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    // resetting the textarea height to its default height once a message is sent
    chatInput.style.height = `${inputInitHeight}px` 

    // append chat to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // display "thinking..." message while waiting for the response
        const incomingChatLi = createChatLi('thinking', "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        // generate response
        generateResponse(incomingChatLi);
    }, 600);

}

chatInput.addEventListener('input', () => {
    // adjust height of the input textarea based on it's content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener('keydown', () => {
    // send a message on the click of the enter button, but go to the next line on the shift+enter click.
    // if Enter key is pressed without shift key and the window width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})
sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));