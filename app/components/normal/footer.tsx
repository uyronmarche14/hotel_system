import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaLinkedin, FaWhatsapp, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2F4F4F] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About Us Section */}
          <div>
            <Image
              src="/logo.png"
              alt="The Anetos Palace"
              width={200}
              height={50}
            />
            <div className="mt-4 space-y-2">
              <Link
                href="/about/overview"
                className="block hover:text-gray-300"
              >
                Company Overview
              </Link>
              <Link href="/about/mission" className="block hover:text-gray-300">
                Our Mission & Values
              </Link>
              <Link href="/careers" className="block hover:text-gray-300">
                Careers
              </Link>
              <Link href="/blog" className="block hover:text-gray-300">
                Blog
              </Link>
              <Link href="/press" className="block hover:text-gray-300">
                Press Releases
              </Link>
            </div>
          </div>

          {/* Customer Service Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <div className="space-y-2">
              <Link href="/contact" className="block hover:text-gray-300">
                Contact Us
              </Link>
              <Link href="/faqs" className="block hover:text-gray-300">
                FAQs
              </Link>
              <Link href="/chat" className="block hover:text-gray-300">
                Live Chat
              </Link>
              <Link href="/cancellation" className="block hover:text-gray-300">
                Cancellation Policy
              </Link>
              <Link
                href="/booking-policies"
                className="block hover:text-gray-300"
              >
                Booking Policies
              </Link>
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <div className="space-y-2">
              <Link href="/destinations" className="block hover:text-gray-300">
                Destinations
              </Link>
              <Link
                href="/special-offers"
                className="block hover:text-gray-300"
              >
                Special Offers
              </Link>
              <Link href="/last-minute" className="block hover:text-gray-300">
                Last-Minute Deals
              </Link>
              <Link href="/travel-guides" className="block hover:text-gray-300">
                Travel Guides
              </Link>
              <Link href="/blog-tips" className="block hover:text-gray-300">
                Blog & Travel Tips
              </Link>
            </div>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block hover:text-gray-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-gray-300">
                Terms & Conditions
              </Link>
              <Link href="/accessibility" className="block hover:text-gray-300">
                Accessibility
              </Link>
              <Link href="/feedback" className="block hover:text-gray-300">
                Feedback & Suggestions
              </Link>
              <Link href="/sitemap" className="block hover:text-gray-300">
                Sitemap
              </Link>
            </div>
          </div>

          {/* Membership Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Membership</h3>
            <div className="space-y-2">
              <Link href="/loyalty" className="block hover:text-gray-300">
                Loyalty Program
              </Link>
              <Link href="/exclusive" className="block hover:text-gray-300">
                Unlock Exclusive Offers
              </Link>
              <Link href="/rewards" className="block hover:text-gray-300">
                Rewards & Benefits
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-600 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2025 The Anetos Palace. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:opacity-80">
              <FaTwitter size={24} />
            </Link>
            <Link href="#" className="hover:opacity-80">
              <FaLinkedin size={24} />
            </Link>
            <Link href="#" className="hover:opacity-80">
              <FaWhatsapp size={24} />
            </Link>
            <Link href="#" className="hover:opacity-80">
              <FaFacebook size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
