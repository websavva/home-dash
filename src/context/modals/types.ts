import type { JSX } from 'react';

export type OnSubmitHandler<Payload = any> = (payload: Payload) => any;

export type OnCloseHandler = () => any;

export interface ModalProps<Payload = any> {
  onSubmit: OnSubmitHandler<Payload>;
  onClose?: OnCloseHandler;
}

export type ModalComponent<P = any> = (props: ModalProps<P>) => JSX.Element;

export type OpenModalHandler<P = any> = (
  Component: ModalComponent<P>,
  props: ModalProps<P>,
) => Promise<P | null>;

export interface ModalItem<P = any> {
  id: string;
  Component: ModalComponent<P>;
  props: ModalProps<P>;
  resolve: (payload: P | undefined) => void;
  promise: Promise<P | undefined>;
}

export interface ModalsContextSchema {
  openedModals: ModalItem[];

  open: OpenModalHandler;

  remove: (id: string) => void;
}
