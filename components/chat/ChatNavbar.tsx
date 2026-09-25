'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Logo from '@/components/brand/Logo';
import type { ChatStatus } from '@/hooks/useVideoChat';
import { api, errorMessage } from '@/lib/api-client';
import styles from './Chat.module.scss';

const STATUS_LABELS: Partial<Record<ChatStatus, { label: string; tone: string }>> = {
  starting: { label: 'Starting camera', tone: styles.pillPending },
  searching: { label: 'Finding a match', tone: styles.pillPending },
  waiting: { label: 'Waiting for someone', tone: styles.pillPending },
  connected: { label: 'Connected', tone: styles.pillLive },
};

type ChatNavbarProps = {
  user: { email: string; university: string };
  status: ChatStatus;
  /** Ends any active call before signing out. */
  onLeave: () => Promise<void>;
};

export default function ChatNavbar({ user, status, onLeave }: ChatNavbarProps) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const pill = STATUS_LABELS[status];

  async function logOut() {
    await onLeave();
    await api('/api/auth/logout').catch(() => undefined);
    router.replace('/login');
    router.refresh();
  }

  async function deleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onLeave();
      await api('/api/account', { method: 'DELETE' });
      router.replace('/');
      router.refresh();
    } catch (error) {
      setDeleteError(errorMessage(error));
      setDeleting(false);
    }
  }

  return (
    <header className={styles.navbar}>
      <Logo href="/chat" size={30} />

      {pill && (
        <span className={`${styles.pill} ${pill.tone}`} role="status">
          <span className={styles.pillDot} aria-hidden />
          {pill.label}
        </span>
      )}

      <Dropdown align="end">
        <Dropdown.Toggle variant="glass" size="sm" id="account-menu" className="px-3">
          <i className="bi bi-person-circle" aria-hidden />
          <span className="d-none d-sm-inline">Account</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="shadow-lg">
          <Dropdown.Header>
            <div className="text-body fw-semibold text-truncate" style={{ maxWidth: 240 }}>
              {user.email}
            </div>
            <div className="small">{user.university}</div>
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item as="button" onClick={logOut}>
            <i className="bi bi-box-arrow-right me-2" aria-hidden /> Log out
          </Dropdown.Item>
          <Dropdown.Item as="button" className="text-danger" onClick={() => setConfirmDelete(true)}>
            <i className="bi bi-trash3 me-2" aria-hidden /> Delete account
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={confirmDelete} onHide={() => !deleting && setConfirmDelete(false)} centered>
        <Modal.Header closeButton={!deleting}>
          <Modal.Title as="h2" className="h5 mb-0">
            Delete your account?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0 text-body-secondary">
            This permanently deletes the CamRa account for <strong className="text-body">{user.email}</strong>.
            This can&rsquo;t be undone.
          </p>
          {deleteError && <div className="alert alert-danger small mt-3 mb-0">{deleteError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="glass" onClick={() => setConfirmDelete(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAccount} disabled={deleting}>
            {deleting && <span className="spinner-border spinner-border-sm" aria-hidden />}
            Delete account
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
}
