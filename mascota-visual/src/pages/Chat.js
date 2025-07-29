import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { 
  getConversations, 
  getMessages, 
  sendMessage,
  markAsRead,
  getUnreadCount
} from '../api';
import { useSoundEffects } from '../components/SoundEffects';
import NotificationToast from '../components/NotificationToast';
import './Chat.css';

const Chat = () => {
  const { token, user } = useUser();
  const { playClick, playCoin } = useSoundEffects();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchUnreadCount, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const conversationsData = await getConversations(token);
      setConversations(conversationsData);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setNotification({ message: 'Error al cargar conversaciones', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const messagesData = await getMessages(conversationId, token);
      setMessages(messagesData);
      
      // Marcar como leído
      await markAsRead(conversationId, token);
      
      // Actualizar conversación
      setConversations(prev => 
        prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (err) {
      console.error('Error fetching messages:', err);
      setNotification({ message: 'Error al cargar mensajes', type: 'error' });
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount(token);
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      playClick();
      
      const messageData = await sendMessage(selectedConversation._id, newMessage, token);
      
      // Agregar mensaje a la lista
      setMessages(prev => [...prev, messageData]);
      
      // Limpiar input
      setNewMessage('');
      
      // Actualizar última actividad en conversación
      setConversations(prev => 
        prev.map(conv => 
          conv._id === selectedConversation._id 
            ? { ...conv, lastMessage: newMessage, lastActivity: new Date() }
            : conv
        )
      );
      
    } catch (err) {
      console.error('Error sending message:', err);
      setNotification({ message: 'Error al enviar mensaje', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="chat-container">
        <div className="loading-message">
          <div className="loading-spinner">💬</div>
          <p>Cargando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'info' })} 
      />

      {/* Header */}
      <div className="chat-header">
        <h1>💬 Chat</h1>
        <div className="chat-stats">
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <span className="stat-label">Conversaciones:</span>
            <span className="stat-value">{conversations.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📨</span>
            <span className="stat-label">No leídos:</span>
            <span className="stat-value">{unreadCount}</span>
          </div>
        </div>
      </div>

      <div className="chat-content">
        {/* Lista de conversaciones */}
        <div className="conversations-sidebar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="no-conversations">
                <div className="no-conversations-icon">💬</div>
                <h3>No hay conversaciones</h3>
                <p>¡Inicia una conversación con tus amigos!</p>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div 
                  key={conversation._id} 
                  className={`conversation-item ${selectedConversation?._id === conversation._id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    playClick();
                  }}
                >
                  <div className="conversation-avatar">
                    <img 
                      src={conversation.participant.avatar || '/assets/hero.svg'} 
                      alt={conversation.participant.username}
                      className="avatar-img"
                    />
                    {conversation.participant.online && (
                      <div className="online-indicator"></div>
                    )}
                  </div>
                  
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h3 className="conversation-name">{conversation.participant.username}</h3>
                      <span className="conversation-time">
                        {formatTime(conversation.lastActivity)}
                      </span>
                    </div>
                    
                    <p className="conversation-preview">
                      {conversation.lastMessage || 'No hay mensajes'}
                    </p>
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="unread-badge">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="messages-area">
          {selectedConversation ? (
            <>
              {/* Header del chat */}
              <div className="chat-messages-header">
                <div className="chat-participant">
                  <img 
                    src={selectedConversation.participant.avatar || '/assets/hero.svg'} 
                    alt={selectedConversation.participant.username}
                    className="participant-avatar"
                  />
                  <div className="participant-info">
                    <h3 className="participant-name">{selectedConversation.participant.username}</h3>
                    <span className="participant-status">
                      {selectedConversation.participant.online ? '🟢 En línea' : '⚪ Desconectado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <div className="no-messages-icon">💬</div>
                    <h3>No hay mensajes</h3>
                    <p>¡Inicia la conversación!</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message._id} 
                      className={`message ${message.sender._id === user?._id ? 'own' : 'other'}`}
                    >
                      <div className="message-content">
                        <p className="message-text">{message.content}</p>
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      
                      {message.sender._id !== user?._id && (
                        <div className="message-avatar">
                          <img 
                            src={message.sender.avatar || '/assets/hero.svg'} 
                            alt={message.sender.username}
                            className="avatar-img"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensaje */}
              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="message-input"
                    rows="1"
                  />
                  <button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                  >
                    {sending ? '⏳' : '📤'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">💬</div>
              <h3>Selecciona una conversación</h3>
              <p>Elige una conversación para comenzar a chatear</p>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="chat-info">
        <div className="info-card">
          <h3>💡 Funciones del Chat</h3>
          <div className="chat-features">
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span className="feature-name">Mensajes</span>
              <span className="feature-desc">Envía mensajes en tiempo real</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span className="feature-name">Conversaciones</span>
              <span className="feature-desc">Chatea con tus amigos</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📨</span>
              <span className="feature-name">Notificaciones</span>
              <span className="feature-desc">Recibe notificaciones de nuevos mensajes</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🟢</span>
              <span className="feature-name">Estado en línea</span>
              <span className="feature-desc">Ve quién está conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 