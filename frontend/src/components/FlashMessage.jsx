import React from 'react'
const FlashMessage = ({ messages }) => {
  return (
    <div className="floating-alerts">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`alert alert-${message.type || 'success'} text-center floating-alert shadow-sm`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default FlashMessage