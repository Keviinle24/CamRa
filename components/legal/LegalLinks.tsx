'use client';

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PrivacyContent from './PrivacyContent';
import TermsContent from './TermsContent';

type Doc = 'terms' | 'privacy' | null;

/** "By continuing you agree to…" line whose links open the documents in a modal, so forms keep their state. */
export default function LegalLinks({ action = 'continuing' }: { action?: string }) {
  const [open, setOpen] = useState<Doc>(null);

  const link = (doc: Exclude<Doc, null>, label: string) => (
    <button type="button" className="link-button" onClick={() => setOpen(doc)}>
      {label}
    </button>
  );

  return (
    <>
      <p className="small text-body-secondary text-center mb-0">
        By {action}, you agree to CamRa&rsquo;s {link('terms', 'Terms of Service')} and {link('privacy', 'Privacy Policy')}.
      </p>
      <Modal show={open !== null} onHide={() => setOpen(null)} size="lg" scrollable centered fullscreen="sm-down">
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h4 mb-0">
            {open === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="scroll-thin">{open === 'privacy' ? <PrivacyContent /> : <TermsContent />}</Modal.Body>
        <Modal.Footer>
          <Button variant="gradient" onClick={() => setOpen(null)}>
            Got it
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
