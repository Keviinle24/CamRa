'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '@/components/brand/Logo';
import styles from './SiteNavbar.module.scss';

const SECTIONS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#community', label: 'Community' },
  { href: '/#contact', label: 'Contact' },
];

export default function SiteNavbar() {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      className={`${styles.navbar} ${scrolled || expanded ? styles.solid : ''}`}
    >
      <Container>
        <Logo />
        <Navbar.Toggle aria-controls="site-nav" className={styles.toggle}>
          <i className={`bi ${expanded ? 'bi-x-lg' : 'bi-list'}`} aria-hidden />
        </Navbar.Toggle>
        <Navbar.Collapse id="site-nav">
          <Nav className="ms-lg-auto me-lg-3 gap-lg-2 pt-3 pt-lg-0">
            {SECTIONS.map(({ href, label }) => (
              <Nav.Link key={href} as={Link} href={href} onClick={close} className={styles.link}>
                {label}
              </Nav.Link>
            ))}
          </Nav>
          <div className="d-flex flex-column flex-lg-row gap-2 py-3 py-lg-0">
            <Link href="/login" className="btn btn-glass" onClick={close}>
              Log in
            </Link>
            <Link href="/register" className="btn btn-gradient" onClick={close}>
              Sign up
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
