"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { Plane, Menu, X, ArrowUpRight, MessageCircle } from "lucide-react";
import { business, navigation, enabledServices } from "@/config/business";
import { WhatsappLink } from "./whatsapp-link";
export function Brand() {
  if (business.logo)
    return (
      <Link href="/" className="brand" aria-label="Aurix Travels home">
        <Image
          src={business.logo}
          width={200}
          height={50}
          alt={business.name}
        />
      </Link>
    );
  return (
    <Link href="/" className="brand" aria-label="Aurix Travels home">
      <span className="brand-symbol">
        <Plane size={26} />
      </span>
      <span>
        AURIX TRAVELS<span className="brand-sub">LIMITED</span>
      </span>
    </Link>
  );
}
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <header className="header">
      <div className="container nav">
        <Brand />
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-nav"
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              menuButton.current?.focus();
            }
          }}
        >
          {navigation.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            className="button nav-quote"
            href="/#flight-enquiry"
            onClick={() => setOpen(false)}
          >
            Get a Quote <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <>
      <footer>
        <div className="container footer-invitation">
          <div>
            <span className="eyebrow">A WORLD OF POSSIBILITIES</span>
            <h2>Where will your next story begin?</h2>
          </div>
          <Link href="/#flight-enquiry" className="text-link">
            Plan a journey with us <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="container footer-grid">
          <div>
            <Brand />
            <p>
              Thoughtful travel. Personal assistance.
              <br />A world of possibilities.
            </p>
            <a href={`mailto:${business.email}`}>{business.email}</a>
            {business.phone && <p>{business.phone}</p>}
            {business.address && <p>{business.address}</p>}
          </div>
          <div>
            <h3>Explore</h3>
            {navigation.slice(1).map(([l, h]) => (
              <Link key={h} href={h}>
                {l}
              </Link>
            ))}
          </div>
          <div>
            <h3>How we can help</h3>
            {enabledServices.map((s) => (
              <Link key={s.id} href={`/services#${s.id}`}>
                {s.name}
              </Link>
            ))}
            <Link href="/#flight-enquiry">Request a flight quote</Link>
          </div>
          <div>
            <h3>Let’s plan something good.</h3>
            <p>Your next journey starts with a conversation.</p>
            <WhatsappLink className="text-link">
              Talk to us <ArrowUpRight size={16} />
            </WhatsappLink>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          <div>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </footer>
      <WhatsappLink className="floating-chat">
        <MessageCircle size={21} />
        <span>Let’s talk travel</span>
      </WhatsappLink>
    </>
  );
}
