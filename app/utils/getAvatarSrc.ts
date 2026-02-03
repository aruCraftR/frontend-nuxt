
export default function getAvatarSrc(player: PlayerInfo) {
    switch (player.avatar.source) {
        case 'mc_skin': return `https://avatars.cloudhaven.gg/avatars/${player.uuid || '853c80ef3c3749fdaa49938b674adae6'}`;
        case 'qq': return `https://q1.qlogo.cn/g?b=qq&nk=${player.avatar.qq_id}&s=140`;
    }
}
