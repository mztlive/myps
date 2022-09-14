import { writeText } from "@tauri-apps/api/clipboard";
import { sendNotification } from "@tauri-apps/api/notification";
import { Component, createSignal, Match, Switch } from "solid-js";
import { ContentProp } from "../../../define/types";
import "./Content.css";


const Content: Component<ContentProp> = (props: ContentProp) => {

    const [titleIsEditMode, setTitleIsEditMode] = createSignal(false)

    const [record, setRecord] = props.record

    const remove = async () => {
        if (await confirm("确认删除该记录吗？")) {
            props.onRemove()
        }
    }

    const copyPassword = async (password: string) => {
        await writeText(password)
        sendNotification("密码已经复制到剪切板")
    }

    const save = async () => {
        props.onSave()
    }

    return (
        <div id="content" class="w-3/4">
            <Switch>
                <Match when={titleIsEditMode()}>
                    <input
                        onblur={() => { setTitleIsEditMode(false) }}
                        onchange={(e) => {
                            setRecord({
                                ...record(),
                                title: e.currentTarget.value
                            })
                        }}
                        id="title-ipnut" type="text" class="w-full input input-xl input-bordered" value={record().title} />
                </Match>
                <Match when={!titleIsEditMode()}>
                    <div class="flex flex-row items-center mb-5" onclick={() => {
                        setTitleIsEditMode(true)
                        document.getElementById("title-ipnut")?.focus()
                    }}>
                        <span class="text-2xl block">{record().title}</span>
                        <svg class="icon block ml-3" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8975" width="16" height="16"><path d="M1018.319924 112.117535q4.093748 9.210934 6.652341 21.492179t2.558593 25.585928-5.117186 26.609365-16.374994 25.585928q-12.281245 12.281245-22.003898 21.492179t-16.886712 16.374994q-8.187497 8.187497-15.351557 14.32812l-191.382739-191.382739q12.281245-11.257808 29.167958-27.121083t28.144521-25.074209q14.32812-11.257808 29.679676-15.863275t30.191395-4.093748 28.656239 4.605467 24.050772 9.210934q21.492179 11.257808 47.589826 39.402329t40.425766 58.847634zM221.062416 611.554845q6.140623-6.140623 28.656239-29.167958t56.289041-56.80076l74.710909-74.710909 82.898406-82.898406 220.038979-220.038979 191.382739 192.406177-220.038979 220.038979-81.874969 82.898406q-40.937484 39.914047-73.687472 73.175753t-54.242167 54.753885-25.585928 24.562491q-10.234371 9.210934-23.539054 19.445305t-27.632802 16.374994q-14.32812 7.16406-41.960921 17.398431t-57.824197 19.957024-57.312478 16.886712-40.425766 9.210934q-27.632802 3.070311-36.843736-8.187497t-5.117186-37.867173q2.046874-14.32812 9.722653-41.449203t16.374994-56.289041 16.886712-53.730448 13.304682-33.773425q6.140623-14.32812 13.816401-26.097646t22.003898-26.097646z" p-id="8976" fill="#ffffff"></path></svg>
                    </div>
                </Match>
            </Switch>
            <div class="form-item mb-2 flex flex-col">
                <label class="label mr-3 block w-1/6">
                    <span class="label-text text-sm">URL: </span>
                </label>
                <input type="text" placeholder="输入网址"
                    value={record().url}
                    class="w-full input input-sm input-bordered" onchange={(e) => {
                        setRecord({
                            ...record(),
                            url: e.currentTarget.value
                        })
                    }} />
            </div>
            <div class="form-item mb-2 flex flex-col">
                <label class="label mr-3 block w-1/6">
                    <span class="label-text text-sm">Account: </span>
                </label>
                <input type="text" placeholder="输入账号"
                    value={record().account}
                    class="w-full input input-sm input-bordered" onchange={(e) => {
                        setRecord({
                            ...record(),
                            account: e.currentTarget.value
                        })
                    }} />
            </div>
            <div class="form-item mb-2 flex flex-col">
                <label class="label mr-3 block w-1/6">
                    <span class="label-text text-sm">Password: </span>
                </label>
                <input type="password" placeholder="输入密码"
                    value={record().password}
                    class="input input-sm input-bordered" onchange={(e) => {
                        setRecord({
                            ...record(),
                            password: e.currentTarget.value
                        })
                    }} />
                <svg onclick={() => { copyPassword(record().password) }} class="copy-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2415" width="16" height="16"><path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z" p-id="2416" fill="#ffffff"></path><path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="2417" fill="#ffffff"></path><path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="2418" fill="#ffffff"></path></svg>
            </div>
            <div class="form-item mb-2 flex flex-col">
                <label class="label mr-3 block w-1/6">
                    <span class="label-text text-sm">Remark: </span>
                </label>
                <textarea class="textarea  textarea-bordered w-full"
                    value={record().remark}
                    placeholder="输入备注" onchange={(e) => {
                        setRecord({
                            ...record(),
                            remark: e.currentTarget.value
                        })
                    }}></textarea>
            </div>

            <div class="form-item text-right mt-3">
                <button class="btn btn-active btn-xs btn-ghost mr-3" onclick={remove} >Remove</button>
                <button class="btn btn-active btn-xs btn-accent" onClick={save}>Save</button>
            </div>
        </div>
    )
}


export default Content