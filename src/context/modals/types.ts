import type { JSX } from 'react';

export type SubmitHandler<Payload = any> = (payload: Payload) => any;

export type CloseHandler = () => any;

export interface ModalBaseProps<Payload = any> {
  submit: SubmitHandler<Payload>;
  close: CloseHandler;
}

export type ModalProps<
  Payload = any,
  ExtraProps extends Record<string, any> = Record<string, any>,
> = ModalBaseProps<Payload> & ExtraProps;

export type PartialModalProps<
  Payload = any,
  ExtraProps extends Record<string, any> = Record<string, any>,
> = Partial<ModalBaseProps<Payload>> & ExtraProps;

export type ModalComponent<P = any> = (props: ModalProps<P>) => JSX.Element;

export type OpenModalHandler<P = any> = (
  Component: ModalComponent<P>,
  props?: PartialModalProps<P>,
) => Promise<P | null>;

export interface ModalItem<P = any> {
  id: string;
  Component: ModalComponent<P>;
  props?: PartialModalProps<P>;
  resolve: (payload: P | undefined) => void;
  promise: Promise<P | undefined>;
}

export interface ModalsContextSchema {
  openedModals: ModalItem[];

  open: OpenModalHandler;

  remove: (id: string) => void;
}
