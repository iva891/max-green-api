import { ChatWindow } from './components/chat-window';
import { LoginScreen } from './components/login-screen';
import { Sidebar } from './components/sidebar';
import { useAppStore } from './hooks/useAppStore';

const App = () => {
  const {
    credentials,
    chats,
    activeChatId,
    activeChat,
    activeMessages,
    loginError,
    sidebarError,
    creatingChat,
    sending,
    handleLogin,
    handleLogout,
    handleSelectChat,
    handleCreateChat,
    handleSend,
  } = useAppStore();

  if (!credentials) {
    return <LoginScreen onSubmit={handleLogin} error={loginError} />;
  }

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        onLogout={handleLogout}
        creating={creatingChat}
        error={sidebarError}
      />
      <ChatWindow
        chat={activeChat}
        messages={activeMessages}
        onSend={handleSend}
        sending={sending}
      />
    </div>
  );
};

export default App;
