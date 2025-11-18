import { Twitter, Linkedin, Github } from 'lucide-react'; 

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: ['Features', 'Pricing', 'Documentation', 'Get Started'],
    company: ['About Us', 'Blog', 'Careers', 'Contact'],
    legal: ['Privacy Policy', 'Terms of Service', 'Security', 'Sitemap'],
  };
  
  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: '#' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#' },
    { icon: <Github className="w-5 h-5" />, href: '#' },
  ];

  return (
    <footer className="w-full bg-[#0b1120] text-slate-300 py-16 px-6 border-t border-teal-400/20 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Column 1: Logo & Tagline */}
          <div className="col-span-2 md:col-span-2">
            <h2 className="text-3xl font-extrabold text-teal-400 tracking-wider">
              AttriSense
            </h2>
            <p className="mt-4 text-sm text-slate-400 max-w-sm">
              The AI-powered HR analytics platform engineered to **proactively** predict and prevent employee attrition.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition duration-200"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-teal-400/50 pb-1">Product</h3>
            <ul className="space-y-3 text-sm">
              {links.product.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-teal-400 transition duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-teal-400/50 pb-1">Company</h3>
            <ul className="space-y-3 text-sm">
              {links.company.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-teal-400 transition duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-teal-400/50 pb-1">Legal</h3>
            <ul className="space-y-3 text-sm">
              {links.legal.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-teal-400 transition duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separator and Copyright */}
        <div className="text-center pt-10 mt-12 border-t border-white/10 text-xs text-slate-500">
          <p>
            © {currentYear} AttriSense. All Rights Reserved. | Built for the future of HR.
          </p>
        </div>
      </div>
    </footer>
  );
}