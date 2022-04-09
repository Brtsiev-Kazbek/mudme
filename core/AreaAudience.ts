import ChannelAudience from './ChannelAudience'; // FIXME: add ChannelAudience implementation

/**
 * Audience class representing characters in the same area as the sender
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
export class Audience extends ChannelAudience {
    getBroadcastTargets() {
        if (!this.sender.room) {
            return [];
        }

        const { area } = this.sender.room;
        return area
            .broadcastTargets()
            .filter((target) => target !== this.sender);
    }
}
