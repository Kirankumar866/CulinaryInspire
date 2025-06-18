import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Portfolio', active: location === '/' },
    { href: '/case-studies', label: 'Case Studies', active: location.startsWith('/case-studies') },
    { href: '/ai-tools', label: 'AI Tools', active: location.startsWith('/ai-tools') },
    { href: '/community', label: 'Community', active: location.startsWith('/community') },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-display font-bold text-primary">CookCraft</h1>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                      item.active 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-500 hover:text-primary'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        item.active 
                          ? 'text-gray-900 bg-gray-100' 
                          : 'text-gray-500 hover:text-primary'
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  <Button className="bg-primary text-white hover:bg-primary/90 mt-4">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
