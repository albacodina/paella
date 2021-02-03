import PlayerResource from 'paella/core/PlayerResource';
import { getVideoPlugin } from 'paella/core/VideoPlugin';

export default class SteramProvider extends PlayerResource {
	constructor(player, videoContainer) {
		super(player, videoContainer);
		this._videoContainer = videoContainer;
		this._streamData = null;
		this._streams = null;
		this._players = [];
		
		this._streamSyncTimer = null;
	}
	
	async load(streamData) {
		this._streamData = streamData;
		this._streams = {};
		
		console.debug("Finding compatible video plugins");
		
		// Find video plugins for each stream
		this._streamData.forEach(stream => {
			const videoPlugin = getVideoPlugin(this.player, stream);
			if (!videoPlugin) {
				throw Error(`Incompatible stream type: ${ stream.content }`);
			}
			
			this._streams[stream.content] = {
				stream,
				videoPlugin
			}
		})
		
		for (const content in this._streams) {
			const s = this._streams[content];
			s.player = await s.videoPlugin.getVideoInstance(this._videoContainer);
			await s.player.load(s.stream);
			this._players.push(s.player);
		}
	}
	
	get players() {
		return this._players;
	}
	
	// This is the raw streamData loaded from the video manifest
	get streamData() {
		return this._streamData;
	}
	
	// This property stores the available streams, indexed by the content identifier, and contains the
	// stream data, the video plugin and the player, for each content identifier.
	get streams() {
		return this._streams;
	}
	
	startStreamSync() {
		
	}
	
	stopStreamSync() {
		
	}
	
	executeAction(fnName, params = []) {
		// Important: this implementation must be done using promises instead of async/await, due to
		// a bug in babel that causes that the resulting array may not be available when the async function
		// is completed.
		return new Promise((resolve) => {
			let res = [];
			let p = [];
			this.players.forEach(player => {
				p.push(new Promise(innerResolve => {
					player[fnName](...params).then(r => {
						res.push(r);
						innerResolve();
					})
				}));
			})
			
			Promise.all(p).then(() => resolve(res));
		})
	}

}