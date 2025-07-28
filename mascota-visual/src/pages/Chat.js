import React, { useEffect, useState, useRef } from 'react';
import { 
  getConversations, 
  getConversationMessages, 
  sendMessage, 
  markMessagesAsRead,
  getUnreadMessagesCount,
  searchMessages
} from '../api';
import './Chat.css';

export default function Chat({ token }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, [token]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.otherParticipant._id);
      markAsRead(selectedConversation.otherParticipant._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getConversations(token);
      setConversations(data);
    } catch (err) {
      setError('Error al cargar conversaciones.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const data = await getConversationMessages(userId, token);
      setMessages(data);
    } catch (err) {
      setError('Error al cargar mensajes.');
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadMessagesCount(token);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const markAsRead = async (senderId) => {
    try {
      await markMessagesAsRead(senderId, token);
      fetchUnreadCount();
      fetchConversations(); // Actualizar contadores
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessage(selectedConversation.otherParticipant._id, newMessage.trim(), token);
      setNewMessage('');
      fetchMessages(selectedConversation.otherParticipant._id);
      fetchConversations(); // Actualizar última mensaje
    } catch (err) {
      setError('Error al enviar mensaje.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchMessages(searchQuery, token);
      setSearchResults(results);
    } catch (err) {
      setError('Error al buscar mensajes.');
    } finally {
      setIsSearching(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };

  const getMessageTypeStyle = (message) => {
    switch (message.type) {
      case 'system':
        return 'message-system';
      case 'achievement':
        return 'message-achievement';
      case 'gift':
        return 'message-gift';
      default:
        return message.sender ? 'message-sent' : 'message-received';
    }
  };

  if (loading) return <div className="chat-container"><p>Cargando chat...</p></div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Chat</h2>
        {unreadCount > 0 && (
          <div className="unread-badge">{unreadCount}</div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="chat-layout">
        {/* Panel de conversaciones */}
        <div className="conversations-panel">
          <div className="search-section">
            <input
              type="text"
              placeholder="Buscar mensajes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? '🔍' : 'Buscar'}
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="search-results">
              <h3>Resultados de búsqueda</h3>
              {searchResults.map(message => (
                <div key={message._id} className="search-result-item">
                  <div className="search-result-header">
                    <span className="sender">
                      {message.sender ? message.sender.username : 'Sistema'}
                    </span>
                    <span className="time">{formatTime(message.createdAt)}</span>
                  </div>
                  <div className="search-result-content">{message.content}</div>
                </div>
              ))}
              <button 
                className="clear-search"
                onClick={() => {
                  setSearchResults([]);
                  setSearchQuery('');
                }}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.length === 0 ? (
                <p className="no-conversations">No tienes conversaciones. ¡Agrega amigos para chatear!</p>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv._id}
                    className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      {conv.otherParticipant.avatar ? (
                        <img src={conv.otherParticipant.avatar} alt={conv.otherParticipant.heroName} />
                      ) : (
                        <div className="default-avatar">👤</div>
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <h4>{conv.otherParticipant.heroName}</h4>
                        {conv.unreadCount > 0 && (
                          <span className="unread-count">{conv.unreadCount}</span>
                        )}
                      </div>
                      <p className="last-message">
                        {conv.lastMessage?.content || 'Sin mensajes'}
                      </p>
                      <span className="last-time">
                        {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ''}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Panel de mensajes */}
        <div className="messages-panel">
          {selectedConversation ? (
            <>
              <div className="messages-header">
                <div className="selected-user">
                  <div className="user-avatar">
                    {selectedConversation.otherParticipant.avatar ? (
                      <img src={selectedConversation.otherParticipant.avatar} alt={selectedConversation.otherParticipant.heroName} />
                    ) : (
                      <div className="default-avatar">👤</div>
                    )}
                  </div>
                  <div className="user-info">
                    <h3>{selectedConversation.otherParticipant.heroName}</h3>
                    <p>@{selectedConversation.otherParticipant.username}</p>
                  </div>
                </div>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>No hay mensajes aún. ¡Inicia la conversación!</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div key={message._id} className={`message ${getMessageTypeStyle(message)}`}>
                      {message.sender && (
                        <div className="message-avatar">
                          {message.sender.heroes && message.sender.heroes.length > 0 ? (
                            <img src={message.sender.heroes[0].avatar} alt={message.sender.username} />
                          ) : (
                            <div className="default-avatar">👤</div>
                          )}
                        </div>
                      )}
                      <div className="message-content">
                        <div className="message-header">
                          <span className="message-sender">
                            {message.sender ? message.sender.username : 'Sistema'}
                          </span>
                          <span className="message-time">{formatTime(message.createdAt)}</span>
                        </div>
                        <div className="message-text">{message.content}</div>
                        {message.metadata?.emoji && (
                          <div className="message-emoji">{message.metadata.emoji}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-container">
                <textarea
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un mensaje..."
                  rows="3"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="send-button"
                >
                  📤
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="select-conversation">
                <h3>💬 Selecciona una conversación</h3>
                <p>Elige un amigo de la lista para comenzar a chatear</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 