import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-float" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-float" style={{ animationDelay: '2s' }} />
         <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {showNav && (
          <nav className="w-full p-6 flex justify-between items-center glass-panel sticky top-0 z-50 border-b-0 border-white/10 mb-4 rounded-b-3xl">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">
              Sajan NGL 😉
            </h1>
            <div className="flex gap-4">
              <a href="#/" className="text-sm font-medium hover:text-pink-400 transition-colors">Inbox</a>
              <a href="#/send" className="text-sm font-medium hover:text-pink-400 transition-colors">Link</a>
            </div>
          </nav>
        )}
        <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col">
          {children}
        </main>
        
        <footer className="p-4 text-center text-white/30 text-xs">
          Powered by Gemini • Sajan NGL © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Layout;