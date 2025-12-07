/* eslint-disable @typescript-eslint/no-explicit-any */
// types/api.d.ts

export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T | null;
}

export interface LoginResponse {
    token: string;
    user: AuthedPlayerInfo;
}

export interface AuthedPlayerInfo extends BasePlayerInfo {
    qq_id: string;
}

export interface BasePlayerInfo {
    player_id: string;
    uuid: string;
}

type ServerStatus = 'active' | 'starting' | 'stopping' | 'stopped' | 'unresponsive'

export interface ServerInfo {
    id: string
    status: ServerStatus
    max_players: number
    player_count: number
    players: BasePlayerInfo[]
}
