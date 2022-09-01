import { Signal } from "solid-js"


export type Record = {
    title: string
    url: string
    account: string
    password: string
    remark: string
}

export type ContentRemoveEvent = () => void

export type ContentSaveEvent = () => void

export type ContentProp = {
    record: Signal<Record>

    onRemove: ContentRemoveEvent

    onSave: ContentSaveEvent
}


export type SideItem = {
    isSelected: () => boolean

    setSelected: (selected: boolean) => void

    title: () => string

    setTitle: (title: string) => void
}

export type SideProp = {
    onSelected: (item: SideItem) => void

    menus: SideItem[]

    onAddIconClick: () => void
}

export type ModalProp = {
    title: string

    content: string
}


export type AppCfg = {
    pemPath: string
    dbDir: string
    password: string
}