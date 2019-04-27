import store from "data/store";
import { openModal as modalOpener, closeModal as modalCloser } from "data/store.modals";

export function openModal(opts){
	store.dispatch(modalOpener(opts));
}

export function closeModal(opts){
	store.dispatch(modalCloser());
}