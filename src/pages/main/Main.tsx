import { useNavigate } from "@solidjs/router";
import { invoke } from "@tauri-apps/api";
import { message } from "@tauri-apps/api/dialog";
import { createEffect, createSignal, JSXElement, Match, Switch } from "solid-js";
import { Record, SideItem } from "../../define/types";
import Content from "./components/Content";
import Side from "./components/Side";

const genDefaultRecord = (): Record => {
    return {
        title: "新建记录",
        account: "",
        password: "",
        remark: "",
        url: ""
    }
}

const genSideItem = (itemTitle: string): SideItem => {
    const [title, setTitle] = createSignal<string>(itemTitle)

    const [isSelected, setSelected] = createSignal<boolean>(false)

    const sideItem: SideItem = {
        title, setTitle, isSelected, setSelected
    }

    return sideItem
}


const Main: JSXElement = () => {

    const navigate = useNavigate()

    const [menus, setMenus] = createSignal<SideItem[]>([])

    const [currentItem, setCurrentItem] = createSignal<Record>(genDefaultRecord())

    const [isSelected, setSelected] = createSignal<boolean>(false)

    let currentItemTitle = ""



    createEffect(async () => {

        const resp = await invoke<string[]>("load")
        const menus = resp.map((itemTitle) => {
            return genSideItem(itemTitle)
        })

        setMenus(menus)

        setInterval(async () => {
            const isLock = await invoke("is_lock")
            if (isLock) {
                navigate("/lock")
                return
            }
        }, 1000)
    }, [])


    const onItemRemove = async () => {

        try {
            await invoke("remove", { title: currentItemTitle })
        } catch (e) {
            message(JSON.stringify(e), { title: "错误", type: "error" })
        }

        setMenus(menus().filter((item) => item.title() !== currentItemTitle))
        setSelected(false)
        setCurrentItem(genDefaultRecord())
    }

    const onItemSave = async () => {
        try {
            if (currentItem().title !== currentItemTitle) {
                await invoke("update", { record: currentItem(), oldTitle: currentItemTitle })
            } else {
                await invoke("add", { record: { ...currentItem() } })
            }

            message("保存成功")
        } catch (e) {
            message(JSON.stringify(e), { title: "错误", type: "error" })
        }

        const item = menus().find((item) => item.title() === currentItemTitle)
        item?.setTitle(currentItem().title)
    }

    const onSelected = async (menu: SideItem) => {

        currentItemTitle = menu.title()
        setSelected(true)
        try {
            let resp = await invoke<Record>("get_details", { title: menu.title() })
            setCurrentItem(resp)
            console.log(resp)
        } catch (e) {
            const error = e as object

            if (error.hasOwnProperty("NoSetPassword")) {
                navigate("/lock")
                return
            }

            message(JSON.stringify(error), { title: "错误", type: "error" })
        }
    }

    const onAddRecord = () => {
        const newItem = genSideItem("新建记录")
        setMenus([...menus(), newItem])
        setCurrentItem(genDefaultRecord())
    }

    return (
        <div class="flex flex-row h-full w-full">
            <Side menus={menus()} onAddIconClick={onAddRecord} onSelected={onSelected}></Side>
            <div id="right-content" class="p-2.5 w-full  flex justify-center items-center">
                <Switch>
                    <Match when={isSelected()}>
                        <Content record={[currentItem, setCurrentItem]} onRemove={onItemRemove} onSave={onItemSave}></Content>
                    </Match>
                    <Match when={!isSelected()}>
                        <div class="flex flex-row items-center">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7793" width="32" height="32"><path d="M149.333333 494.122667a98.026667 98.026667 0 0 0 98.026667 98.026666h186.24v166.613334a64 64 0 0 0 64 64H874.666667V376.533333h-127.424l-108.629334-126.72a103.146667 103.146667 0 0 0-141.44-14.464l-4.778666 3.946667a103.381333 103.381333 0 0 0-13.013334 141.930667l3.84 4.565333 9.173334 10.346667H247.36A98.026667 98.026667 0 0 0 149.333333 494.122667z m348.245334 264.661333V528.149333h-250.24a34.026667 34.026667 0 0 1 0-68.053333h387.584l-103.893334-116.842667-2.432-3.029333a39.381333 39.381333 0 0 1 5.952-52.778667l3.093334-2.453333a39.146667 39.146667 0 0 1 52.394666 6.442667l127.786667 149.077333H810.666667v318.272H497.578667z" p-id="7794" fill="#ffffff"></path></svg>
                            在左边选择一个吧
                        </div>
                    </Match>
                </Switch>
            </div>

        </div>
    )
}

export default Main;