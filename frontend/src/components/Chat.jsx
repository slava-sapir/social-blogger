import React, { useEffect, useRef } from 'react'
import { useApp } from '../context/app-context'
import { useImmer } from 'use-immer';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

const Chat = () => {
 const socket = useRef(null);
 const { isChatOpen, closeChat, user, setChatCount, resetChatCount } = useApp();
 const chatField = useRef(null);
 const chatLog = useRef(null);
 const [state, setState] = useImmer({
  fieldValue: '',
  chatMessages: []
 });

 useEffect(() => {
  if (isChatOpen) {
      chatField.current.focus();
      resetChatCount();
    }
  }, [isChatOpen]);

  useEffect(() => {
  socket.current = io('http://localhost:8080');
  const handler = (message) => {
    setState(draft => {
      draft.chatMessages.push(message);
    });

    if (!isChatOpen) {
      setChatCount();
    }
  };

  socket.current.on("chatFromServer", handler);
  return () => socket.current.off("chatFromServer", handler);
}, [isChatOpen, setChatCount, setState]);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
  }, [state.chatMessages]);

 const handleFieldChange = (e) => {
  setState(draft => {
    const value = e.target.value;
    draft.fieldValue = value;
  });
 };
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.current.emit('chatFromBrowser', { message: state.fieldValue, token: user.token });

    setState(draft => {
      draft.chatMessages.push({ message:draft.fieldValue, username: user.username, avatar: user.avatar });
      draft.fieldValue = "";
    });
  };

  return (
    <div 
      id="chat-wrapper"
      className={"chat-wrapper shadow border-top border-left border-right " 
      + (isChatOpen ? "chat-wrapper--is-visible" : "") }>
      <div className="chat-title-bar bg-primary">
        Chat
        <button
          type="button"
          onClick={closeChat}
          className="chat-title-bar-close"
          aria-label="Close chat"
        >
          <i className="fas fa-times-circle" />
        </button>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((msg, index) => {
          if (msg.username === user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{msg.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={msg.avatar} />
              </div>
            );
          } else {
            return (
              <div key={index} className="chat-other">
                <Link to={`/profile/${msg.username}`}>
                  <img className="avatar-tiny" src={msg.avatar} />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link to={`/profile/${msg.username}`}>
                      <strong>{msg.username}:&nbsp;&nbsp;</strong>
                    </Link>
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          }
        }
        )}
       
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input value={state.fieldValue} onChange={handleFieldChange} ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>

    </div>
  )
}

export default Chat