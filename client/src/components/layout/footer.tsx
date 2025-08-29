import { Link } from "wouter";
import { Box, Twitter, Linkedin, Github } from "lucide-react";
import { SiDiscord } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Box className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold">MakrCave</h3>
            </div>
            <p className="text-sm opacity-80">
              Connecting makers worldwide through a global network of innovative spaces and collaborative communities.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Network</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/locations" className="hover:opacity-100 transition-opacity" data-testid="footer-link-locations">
                  Find Locations
                </Link>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-join">
                  Join Network
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-equipment">
                  Equipment Access
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-membership">
                  Membership
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-projects">
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-events">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-workshops">
                  Workshops
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-forum">
                  Forum
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-help">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-contact">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-docs">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-api">
                  API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80">© 2024 MakrCave. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                data-testid="social-twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                data-testid="social-linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                data-testid="social-github"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                data-testid="social-discord"
              >
                <SiDiscord className="w-4 h-4" />
              </a>
            </div>
            <div className="flex space-x-6 text-sm opacity-80">
              <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-privacy">
                Privacy Policy
              </a>
              <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-terms">
                Terms of Service
              </a>
              <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-cookies">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
