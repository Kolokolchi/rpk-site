"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { logoMark } from "./site-utils";
import { publicPath } from "../../shared/public-path";

const navItems = [
  { label: "Каталог", href: "#services" },
  { label: "Для вашего объекта", href: "#objects" },
  { label: "Работы", href: "#portfolio" },
  { label: "Производство", href: "#production" },
  { label: "Контакты", href: "#contact" },
];

export default function SiteHeader({
  whatsappHref,
  homePrefix = "",
}: {
  whatsappHref: string;
  homePrefix?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    navRef.current
      ?.querySelector<HTMLAnchorElement>("a")
      ?.focus({ preventScroll: true });
    const mobileQuery = window.matchMedia("(max-width: 1100px)");
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus({ preventScroll: true });
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    const closeOnDesktop = () => {
      if (!mobileQuery.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    mobileQuery.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      mobileQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" ref={headerRef}>
      <a
        className="brand"
        href={publicPath(`${homePrefix}#top`)}
        aria-label="RPK.KZ — на главную"
        onClick={() => setMenuOpen(false)}
      >
        <img src={logoMark} alt="" width="212" height="81" />
        <span>
          <small>Рекламно-производственная компания</small>
        </span>
      </a>
      <nav
        id="main-navigation"
        ref={navRef}
        className={`main-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Основная навигация"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={publicPath(`${homePrefix}${item.href}`)}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <a
        className="header-cta"
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Получить расчёт в WhatsApp"
      >
        <span className="header-cta-label-full">Получить расчёт</span>
        <span className="header-cta-label-short" aria-hidden="true">
          Расчёт
        </span>
        <MessageCircle aria-hidden="true" />
      </a>
      <button
        className="menu-toggle"
        ref={menuButtonRef}
        type="button"
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  );
}
