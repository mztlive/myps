import { Component, createSignal, For } from "solid-js";
import { SideItem, SideProp } from "../../../define/types";
import "./Side.css";

const Side: Component<SideProp> = (props: SideProp) => {

    // 当点击菜单的时候触发
    const onSelectMenu = (curItem: SideItem) => {

        curItem.setSelected(true)

        // 其他item都设置为false
        props.menus.forEach((item) => {
            if (item.title() !== curItem.title()) {
                item.setSelected(false)
            }
        })

        // 通知外部，菜单被选中了
        props.onSelected(curItem)
    }

    return (
        <div id="side" class="shadow-2xl flex  w-45 flex-col m-2.5 p-2.5 rounded">
            <div class="flex flex-row justify-center items-center">
                <input type="text" placeholder="输入检索" class="input input-bordered w-full max-w-xs h-8 mr-2" />
                <button class="btn btn-sm btn-circle" onclick={() => { props.onAddIconClick() }}>
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1359" width="16" height="16"><path d="M546.133333 64c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 234.666667v554.666666a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 896h554.666666a106.666667 106.666667 0 0 0 106.56-102.037333L896 789.333333V477.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533334V789.333333a170.666667 170.666667 0 0 1-170.666667 170.666667H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h311.466666z m234.666667 0c4.693333 0 8.533333 3.84 8.533333 8.533333V234.666667h162.133334c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334H789.333333v162.133333a8.533333 8.533333 0 0 1-6.826666 8.362667L780.8 469.333333h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533333V298.666667h-162.133333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333H725.333333V72.533333a8.533333 8.533333 0 0 1 6.826667-8.362666L733.866667 64z" fill="#ffffff" p-id="1360"></path></svg>
                </button>
            </div>
            <br />
            <div class="side-menu h-full overflow-scroll">
                <ul class="menu bg-base-100">
                    <For each={props.menus} fallback={<div>点右上角添加</div>}>
                        {(item) => <li classList={{ bordered: item.isSelected() }} onclick={() => { onSelectMenu(item) }}><a>{item.title()}</a></li>}
                    </For>
                </ul>
            </div>
        </div >
    )
}

export default Side