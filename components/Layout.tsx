import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

interface LayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const links = [
  { href: "/", label: "Головна" },
  { href: "/about", label: "Про проєкт" },
  { href: "/pollutants", label: "Довідник забруднювачів" },
];

export function Layout({ title, description, children }: LayoutProps): JSX.Element {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={description ?? "Навчальний проєкт екологічного моніторингу на Next.js і TypeScript"}
        />
      </Head>

      <div className="app-shell">
        <header className="site-header">
          <div className="container header-row">
            <div>
              <p className="eyebrow">Лабораторна робота №1</p>
              <h1 className="site-title">Eco Monitor SSR</h1>
            </div>

            <nav className="nav">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="container main-content">{children}</main>

        <footer className="site-footer">
          <div className="container footer-row">
            <span>Next.js + TypeScript + SSR + SSG</span>
            <span>Навчальний демо-проєкт для екологічного моніторингу</span>
          </div>
        </footer>
      </div>
    </>
  );
}
