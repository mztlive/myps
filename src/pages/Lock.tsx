import { createSignal, JSXElement } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "@solidjs/router";
import { message } from "@tauri-apps/api/dialog";

const Setting: JSXElement = () => {

    const [password, setPassword] = createSignal<string>("")

    const navigate = useNavigate()

    const unlock = async () => {
        if (password() == "") {
            message("请输入密码", { type: "error", title: "错误" })
            return
        }

        try {
            await invoke("unlock", { password: password() })
            navigate("/main")
        } catch (e) {
            message(JSON.stringify(e), { type: "error", title: "错误" })
        }
    }

    return (
        <div class="flex flex-col justify-center items-center h-full w-full">
            <div id="content" class="mt-2.5 ml-2.5 w-2/4 flex flex-col justify-center items-center">
                <svg class="icon mb-10" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6748" width="128" height="128"><path d="M153.6 469.312v469.376h716.8V469.312H153.6zM64 384h896v640H64V384z m403.2 329.92c-26.752-14.72-44.8-42.304-44.8-73.92 0-47.104 40.128-85.312 89.6-85.312 49.472 0 89.6 38.208 89.6 85.312 0 31.616-18.048 59.136-44.8 73.92v115.968a44.8 44.8 0 0 1-89.6 0v-115.968zM332.8 384h358.4V256c0-94.272-80.256-170.688-179.2-170.688-98.944 0-179.2 76.416-179.2 170.688v128zM512 0c148.48 0 268.8 114.56 268.8 256v128H243.2V256c0-141.44 120.32-256 268.8-256z" fill="#ffffff" p-id="6749"></path></svg>
                <div class="form-item mb-2 flex flex-row items-center">
                    <span class="label-text text-sm block w-28">密钥密码: </span>
                    <input v-model="cfg.password" type="text" placeholder="比如: 123456"
                        class="w-full input input-sm input-bordered" value={password()} oninput={(e) => { setPassword(e.currentTarget.value) }} />

                    <button class="btn btn-active btn-sm btn-accent ml-3" onclick={unlock}>开启</button>
                </div>


            </div>
        </div>
    )
}

export default Setting;