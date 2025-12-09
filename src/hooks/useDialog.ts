import { useState, useCallback } from 'react';

/**
 * Hook for managing modal/dialog state
 */
export function useDialog(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}

/**
 * Hook for managing multiple dialogs
 */
export function useDialogs<T extends string>(
  dialogNames: readonly T[]
): Record<T, ReturnType<typeof useDialog>> {
  const dialogs = {} as Record<T, ReturnType<typeof useDialog>>;

  dialogNames.forEach((name) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dialogs[name] = useDialog();
  });

  return dialogs;
}
