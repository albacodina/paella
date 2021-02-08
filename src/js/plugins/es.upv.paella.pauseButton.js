import ButtonPlugin from 'paella/core/ButtonPlugin';
import Events, { bindEvent } from 'paella/core/Events';

import playIcon from 'icons/pause.svg';

export default class PauseButtonPlugin extends ButtonPlugin {
	get icon() { return playIcon; }
	
	async load() {
		bindEvent(this.player, Events.PLAY, () => {
			this.show();
		});
		bindEvent(this.player, Events.PAUSE, () => {
			this.hide();
		});
		bindEvent(this.player, Events.ENDED, () => {
			this.hide();
		});
	}
	
	async action() {
		await this.player.videoContainer.pause();
	}
}