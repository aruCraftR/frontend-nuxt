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
    user: AuthedPlayerInfo;
}

export interface MinecraftSkinAvatarInfo {
    source: 'mc_skin'
}

export interface QQAvatarInfo {
    source: 'qq'
    qq_id: string
}

export interface PlayerInfo {
    name: string;
    uuid: string;
    avatar: MinecraftSkinAvatarInfo | QQAvatarInfo
}

export interface AuthedPlayerInfo extends PlayerInfo {
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

export interface PlayerSocialAccounts {
    qq?: string
}

export interface PlayerProfile {
    online_qq_suffix: string;
    offline_qq_suffix: string;
    social_accounts: PlayerSocialAccounts;
    avatar_source: 'mc_skin' | 'qq'
}

export interface ServerPlayHistory {
    player: PlayerInfo;
    online_date: string;
    total_time: number;
}

export function getAvatarSrc(player: PlayerInfo) {
    switch (player.avatar.source) {
        case 'mc_skin': return `https://avatars.cloudhaven.gg/avatars/${player.uuid || '853c80ef3c3749fdaa49938b674adae6'}`;
        case 'qq': return `https://q1.qlogo.cn/g?b=qq&nk=${player.avatar.qq_id}&s=140`;
    }
}
