#!/usr/bin/sh

bindgen libuiohook/include/uiohook.h --allowlist-var="UIOHOOK_.*" --allowlist-type="(uiohook_event)|(dispatcher_t)" --allowlist-function="(hook_set_dispatch_proc)|(hook_run)|(hook_stop)" -o src/uiohook.rs
