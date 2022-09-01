import { Component } from "solid-js";
import { render } from "solid-js/web";
import { ModalProp } from "../define/types";


const Modal: Component<ModalProp> = (props: ModalProp) => {
    return (
        <div>
            <input type="checkbox" id="modal" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box relative">
                    <label for="modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 class="text-lg font-bold">{props.title}</h3>
                    <p class="py-4">{props.content}</p>
                </div>
            </div>
        </div>
    )
}



const useModal = () => {

    const showModal = (title: string, content: string) => {
        const modal = Modal({ title, content })
        render(() => modal, document.body)

        const check = document.getElementById("modal") as HTMLInputElement
        check.checked = true
    }

    const hideModal = () => {
        const modal = document.getElementById("modal") as HTMLInputElement
        modal.checked = false
    }

    return [showModal, hideModal]

}

export { useModal }