'use client';

import { useEffect, useRef } from 'react';

const ICONS = {
  danger: 'bi-exclamation-octagon-fill',
  warning: 'bi-exclamation-triangle-fill',
  success: 'bi-check-circle-fill',
};

type FormAlertProps = {
  tone?: keyof typeof ICONS;
  children: React.ReactNode;
};

/**
 * A prominent form message. Give it a new `key` for every attempt so a repeated
 * error visibly re-appears instead of looking like nothing happened.
 */
export default function FormAlert({ tone = 'danger', children }: FormAlertProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);

  return (
    <div ref={ref} className={`alert alert-${tone} form-alert`} role={tone === 'success' ? 'status' : 'alert'}>
      <i className={`bi ${ICONS[tone]}`} aria-hidden />
      <div>{children}</div>
    </div>
  );
}
