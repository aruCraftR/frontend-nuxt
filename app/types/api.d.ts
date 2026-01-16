/* eslint-disable @typescript-eslint/no-explicit-any */
// types/api.d.ts

import type { AccountPermission } from "~/constances";

export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T | null;
}

export interface LoginResponse {
    token: string;
    user: PlayerInfo;
}

export interface PlayerInfo {
    player_id: string;
    uuid: string;
    qq_id: string;
    permission: AccountPermission;
}

type ServerStatus = 'active' | 'starting' | 'stopping' | 'stopped' | 'unresponsive'

export interface ServerInfo {
    id: string
    profile_time: number
    status: ServerStatus
    max_players: number
    player_count: number
    players: PlayerInfo[]
}

export interface ServerProfile {
    server_id: string;
    edit_time: number;
    zh_cn_name?: string;
    en_ww_name?: string;
    mc_version?: string;
    server_version?: string;
    announcement?: string;
}


export interface PlayerProfile {
    online_qq_suffix: string;
    offline_qq_suffix: string;
}
