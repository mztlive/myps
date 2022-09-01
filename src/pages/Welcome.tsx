import { createSignal, JSXElement } from "solid-js";
import { message, open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { AppCfg } from "../define/types";
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "@solidjs/router";

const Welcome: JSXElement = () => {

    const navigate = useNavigate()

    const [cfg, setCfg] = createSignal<AppCfg>({
        password: "",
        pemPath: "",
        dbDir: ""
    })

    const selectDB = async () => {
        const selected = await open({
            directory: true,
            defaultPath: await appDir(),
        })

        if (selected == null) {
            return
        }

        const path = selected as string
        setCfg({ ...cfg(), dbDir: path, pemPath: path })
    }


    const next = async () => {
        if (cfg().password == "") {
            message("错误", "请输入密码")
            return
        }

        if (cfg().pemPath == "") {
            message("错误", "请选择数据目录")
            return
        }
        if (cfg().dbDir == "") {
            message("错误", "请选择数据目录")
            return
        }

        try {
            await invoke("set_cfg", cfg())
            navigate("/main")
        } catch (e) {
            message("错误", JSON.stringify(e))
        }
    }

    return (
        <div class="flex flex-col justify-center items-center h-full w-full">
            <div id="content" class="w-full flex flex-col items-center">
                <div onclick={selectDB} class="mb-5 flex flex-row items-center">
                    <span class="label-text text-sm w-28">数据目录: </span>
                    <input v-model="cfg.password" type="text" disabled placeholder="点击选择目录"
                        class="w-full input input-sm input-bordered" value={cfg().pemPath} />
                </div>
                <div class="form-item mb-10 flex flex-row items-center">
                    <span class="label-text text-sm w-28">密钥密码: </span>
                    <input v-model="cfg.password" type="password" placeholder="输入Rsa密钥的密码"
                        class="w-full input input-sm input-bordered" value={cfg().password} oninput={(e) => { setCfg({ ...cfg(), password: e.currentTarget.value }) }} />
                </div>
                <svg onclick={next} class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5655" width="64" height="64"><path d="M661.333333 392.533333c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l40.533334 40.533334H285.866667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h371.2l-40.533334 40.533333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l96-96c12.8-12.8 12.8-32 0-44.8L661.333333 392.533333z" fill="#ffffff" p-id="5656"></path><path d="M509.866667 32C245.333333 32 32 247.466667 32 512s213.333333 480 477.866667 480S987.733333 776.533333 987.733333 512 774.4 32 509.866667 32z m0 896C281.6 928 96 742.4 96 512S281.6 96 509.866667 96 923.733333 281.6 923.733333 512s-185.6 416-413.866666 416z" fill="#ffffff" p-id="5657"></path></svg>
            </div>
        </div>
    )
}

export default Welcome;