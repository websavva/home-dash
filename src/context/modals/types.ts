import type { JSX } from 'react';

export type SubmitHandler<Payload = any> = (payload: Payload) => any;

export type CloseHandler = () => any;

export interface ModalBaseProps<Payload = any> {
  submit: SubmitHandler<Payload>;
  close: CloseHandler;
}

export type ModalProps<Payload = any, ExtraProps = void> =
  ExtraProps extends Record<string, any>
    ? ModalBaseProps<Payload> & ExtraProps
    : ModalBaseProps<Payload>;

export type PartialModalProps<
  Payload = any,
  ExtraProps = void,
  PartialBaseProps = Partial<ModalBaseProps<Payload>>,
> =
  ExtraProps extends Record<string, any>
    ? PartialBaseProps & ExtraProps
    : PartialBaseProps;

export type ModalComponent<P = any, E = void> = (
  props: ModalProps<P, E>,
) => JSX.Element;

export type OpenModalHandler<P = any, E = void> = (
  Component: ModalComponent<P, E>,
  props?: PartialModalProps<P, E>,
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
