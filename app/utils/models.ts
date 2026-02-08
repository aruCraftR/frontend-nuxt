/* eslint-disable @typescript-eslint/no-explicit-any */

export type Colors =
    | 'neutral'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error';
export type AsideItem = 'sep' | AsideLink;
export type ServerStatus =
    | 'active'
    | 'starting'
    | 'stopping'
    | 'stopped'
    | 'unresponsive';
export type HTTPMethod =
    | 'get'
    | 'post'
    | 'head'
    | 'patch'
    | 'put'
    | 'delete'
    | 'connect'
    | 'options'
    | 'trace';

export interface AsideLink {
    label: string;
    icon: string;
    to: string;
    color?: Colors;
}

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
    source: 'mc_skin';
}

export interface QQAvatarInfo {
    source: 'qq';
    qq_id: string;
}

export interface PlayerInfo {
    name: string;
    uuid: string;
    avatar: MinecraftSkinAvatarInfo | QQAvatarInfo;
}

export interface AuthedPlayerInfo extends PlayerInfo {
    permission: AccountPermission;
}

export interface ServerInfo {
    id: string;
    profile_time: number;
    status: ServerStatus;
    max_players: number;
    player_count: number;
    players: PlayerInfo[];
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
    qq?: string;
}

export interface PlayerProfile {
    online_qq_suffix: string;
    offline_qq_suffix: string;
    social_accounts: PlayerSocialAccounts;
    avatar_source: 'mc_skin' | 'qq';
}

export interface ServerPlayHistory {
    player: PlayerInfo;
    online_date: string;
    total_time: number;
}

export interface MinecraftVersionManifest {
    latest: LatestMinecraftVersions;
    versions: MinecraftVersionInfo[];
}

export interface LatestMinecraftVersions {
    release: string;
    snapshot: string;
}

export interface MinecraftVersionInfo {
    id: string;
    type: 'release' | 'snapshot';
    url: string;
    time: string;
    releaseTime: string;
}
