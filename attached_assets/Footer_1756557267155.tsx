import { useEffect, useRef } from "react";

export function Footer() {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Console Easter Eggs
    (window as any).IAmAMaker = function() {
      console.log('%c🤖 Welcome to Makrx!', 'color: #00FF00; font-size: 20px; font-weight: bold;');
      console.log('%cYou\'ve discovered the secret maker function!', 'color: #00BCD4;');
      console.log('%cType makrStatus() for system info', 'color: #FFEB3B;');
      return 'Access granted. Happy making! 🔧';
    };

    (window as any).makrStatus = function() {
      console.log('%c=== MAKRX SYSTEM STATUS ===', 'color: #00FF00; font-weight: bold;');
      console.log('🏭 Workshop Status: Online');
      console.log('👥 Active Makers: 1,337');
      console.log('🔧 Projects in Progress: 42');
      console.log('🚀 Ideas per Minute: ∞');
      return 'All systems operational!';
    };

    console.log('%c🚀 Makrx loaded successfully!', 'color: #00BCD4; font-size: 16px;');
    console.log('%cTry typing IAmAMaker() in the console!', 'color: #FFEB3B;');
  }, []);

  return (
    <footer className="py-12 border-t border-makr-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <i className="fas fa-code text-makr-yellow text-2xl"></i>
              <span className="text-2xl font-mono font-bold text-makr-yellow">Makrx.org</span>
            </div>
            <p className="text-dark-text mb-6">
              Where the future is made, one hack at a time.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-makr-blue hover:text-makr-yellow transition-colors glitch-hover"
                data-testid="link-github"
              >
                <i className="fab fa-github text-2xl"></i>
              </a>
              <a 
                href="#" 
                className="text-makr-blue hover:text-makr-yellow transition-colors glitch-hover"
                data-testid="link-discord"
              >
                <i className="fab fa-discord text-2xl"></i>
              </a>
              <a 
                href="#" 
                className="text-makr-blue hover:text-makr-yellow transition-colors glitch-hover"
                data-testid="link-twitter"
              >
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a 
                href="#" 
                className="text-makr-blue hover:text-makr-yellow transition-colors glitch-hover"
                data-testid="link-instagram"
              >
                <i className="fab fa-instagram text-2xl"></i>
              </a>
            </div>
          </div>

          <div 
            ref={consoleRef}
            className="console p-4 rounded-lg font-mono text-sm"
            data-testid="footer-console"
          >
            <div className="mb-2">$ makrx --version</div>
            <div className="text-terminal-green mb-2">Makrx v2.0.1 - Dream.Make.Share Framework</div>
            <div className="mb-2">$ IAmAMaker()</div>
            <div className="text-makr-yellow mb-2">{'=> Welcome to the collective, maker!'}</div>
            <div className="mb-2">$ status</div>
            <div className="text-makr-blue mb-2">Online makers: <span className="text-terminal-green">1,337</span></div>
            <div className="mb-2">$ _</div>
            <div className="w-2 h-4 bg-terminal-green animate-pulse inline-block"></div>
          </div>
        </div>

        <div className="border-t border-makr-blue/20 mt-12 pt-8 text-center">
          <p className="text-dark-text font-mono">
            © 2024 Makrx.org - Licensed under MIT | 
            <span className="text-makr-blue cursor-pointer hover:text-makr-yellow glitch-hover ml-2">Privacy Policy</span> | 
            <span className="text-makr-blue cursor-pointer hover:text-makr-yellow glitch-hover ml-2">Terms of Service</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
