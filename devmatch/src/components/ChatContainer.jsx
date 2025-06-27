import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInputchat";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { formatMessageTime } from "../lib/utils";

const themeStyles = {
  coffee: {
    sent: 'bg-yellow-100 text-gray-900',
    received: 'bg-yellow-100 text-gray-900',
    container: 'bg-base-200',
  },
  dark: {
    sent: 'bg-gray-800 text-gray-100',
    received: 'bg-gray-800 text-gray-100',
    container: 'bg-gray-900',
  },
  light: {
    sent: 'bg-gray-100 text-gray-900',
    received: 'bg-gray-100 text-gray-900',
    container: 'bg-gray-50',
  },
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    users
  } = useChatStore();
  const authUser = useAuthStore(state => state.authUser);
  const { theme } = useThemeStore();
  const messageEndRef = useRef(null);

  const currentTheme = themeStyles[theme] || themeStyles.coffee;

  useEffect(() => {
    if (!selectedUser || !selectedUser._id) return;
    
    getMessages(selectedUser._id);
    subscribeToMessages();
    
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser || !selectedUser._id) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#e5ddd5] bg-opacity-30 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')]">
        <span className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">Select a user to start chatting</span>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className={`flex-1 flex flex-col overflow-auto ${currentTheme.container}`}>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col overflow-auto ${currentTheme.container}`}>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {Array.isArray(messages) && messages.length > 0 && messages.map((message) => {
          const myId = String(authUser?.id || "");
          const senderId = String(message?.senderId || "");
          const isMine = senderId === myId;

          let senderUser = null;
          if (isMine) {
            senderUser = authUser;
          } else if (selectedUser && senderId === String(selectedUser._id)) {
            senderUser = selectedUser;
          } else if (Array.isArray(users)) {
            senderUser = users.find(u => String(u._id) === senderId);
          }

          return (
            <div
              key={message?._id || message?.tempId}
              className={`w-full flex ${isMine ? 'justify-end' : 'justify-start'} px-2 py-1`}
            >
              <div className={`max-w-[80%] flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-1`}>
                {!isMine && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={senderUser?.profilePic || senderUser?.image || "/avatar.png"}
                      alt="profile pic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`rounded-lg px-3 py-2 ${isMine 
                    ? `${currentTheme.sent} rounded-tr-none` 
                    : `${currentTheme.received} rounded-tl-none`
                  } shadow-sm relative`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {message?.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-full rounded-md mb-2"
                    />
                  )}
                  {message?.text && <span>{message.text}</span>}
                  <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatMessageTime(message?.createdAt)}
                    {isMine && (
                      <span className="text-white/70">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41 4.24 4.24 8.49-8.48zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {(!Array.isArray(messages) || messages.length === 0) && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500 bg-white p-4 rounded-lg shadow-sm">No messages yet</div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;