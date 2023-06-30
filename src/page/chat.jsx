import { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { BiBot, BiUser } from "react-icons/bi";
import Navbar from "../component/navbar";
import SidebarNav from "../component/sidebar";
import { Helmet } from "react-helmet";

export default function ChatPage() {
  const [chat, setChat] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const name = "admin_test";
    const requestTemp = { sender: "user", sender_id: name, msg: inputMessage };

    if (inputMessage !== "") {
      setChat((chat) => [...chat, requestTemp]);
      setBotTyping(true);
      setInputMessage("");
      rasaAPI(name, inputMessage);
    } else {
      window.alert("Please enter a valid message");
    }
  };

  const rasaAPI = async function handleClick(name, msg) {
    console.log(`${process.env.REACT_APP_RASA_CHAT}`);
    await fetch(`${process.env.REACT_APP_RASA_CHAT}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        charset: "UTF-8",
      },
      credentials: "same-origin",
      body: JSON.stringify({ sender: name, message: msg }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response && response.length > 0) {
          const temp = response[0];
          const recipientId = temp["recipient_id"];
          const recipientMsg = temp["text"];

          const responseTemp = {
            sender: "bot",
            recipientId: recipientId,
            msg: recipientMsg,
          };
          setBotTyping(false);

          setChat((chat) => [...chat, responseTemp]);
        }
      })
      .catch((err) => {
        const responseTemp = {
          sender: "bot",
          recipientId: "errorRecipient",
          msg: "Tidak dapat menerima pesan dari ChatVeteran, mohon periksa kondisi chatbot",
        };

        setBotTyping(false);
        setChat((chat) => [...chat, responseTemp]);
      });
  };

  return (
    <div>
      <Helmet>
        <title>Chat</title>
      </Helmet>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="bg-white rounded-t-lg border border-gray-200 p-3">
            <h1 className="text-lg font-bold">ChatVeteran</h1>
            {botTyping && <h6>Bot Typing....</h6>}
          </div>
          <div
            className="bg-gray-100 p-3 h-96 overflow-auto"
            ref={messageAreaRef}
          >
            {chat.map((user, key) => (
              <div key={key}>
                {user.sender === "bot" ? (
                  <div className="flex items-start mb-2">
                    <BiBot className="text-gray-500 mt-1 mr-2" />
                    <h5
                      className="bg-white p-2 rounded-lg"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {user.msg}
                    </h5>
                  </div>
                ) : (
                  <div className="flex items-end justify-end mb-2">
                    <h5 className="bg-blue-500 text-white p-2 rounded-lg">
                      {user.msg}
                    </h5>
                    <BiUser className="text-gray-500 mt-1 ml-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-gray-100 rounded-b-lg p-3">
            <form className="flex items-center" onSubmit={handleSubmit}>
              <input
                className="flex-grow p-2 rounded-l-lg border border-gray-300 focus:outline-none"
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg p-2"
              >
                <IoMdSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
