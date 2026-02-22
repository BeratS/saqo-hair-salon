import { Car, Mail, MapPin,Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-white pt-10 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Column 1: Logo & Info */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <Car className="h-5 w-5 text-primary" />
              <span className="font-mono uppercase">Auto Transport - IRFAN</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional vehicle logistics and towing services. 
              Reliable transport across the region.
            </p>
          </div>

          {/* Column 2: Contact Info */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-900">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +41 XX XXX XX XX
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@autotransport.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Zurich, Switzerland
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Pages */}
          <div className="flex flex-col md:items-end gap-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-900">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground md:text-right">
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refunds" className="hover:text-primary transition-colors">Refund Policy</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Auto Transport - IRFAN. All rights reserved.
          </p>
          <div className="flex gap-6">
            {/* Social Icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}