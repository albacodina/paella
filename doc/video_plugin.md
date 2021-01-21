# Extend video formats

A video format is composed by two elements:

- A video player: adds the player to the Paella Player DOM tree, and implements the playback functions.
- A video plugin: it allows to register the video player as a plugin that can playback certain video format.

## Video player

```javascript
import VideoPlugin, { Video } from 'paella/core/VideoPlugin';

export class MyVideoPlayer extends Video {

    constructor(player, parent) {
        super(player, {
            tag: 'video',   // Define here the DOM element type of the player
            parent
        });
    }

    // Implement the following functions and properties 
    async play() { ... }
    
    async pause() { ... }

    async duration() {... }

    async currentTime() { ... }

    async setCurrentTime(t) { ... }

    async volume() { ... }

    async setVolume(v) { ... }

    async paused() { ... }

    async playbackRate() { ... }

    async setPlaybackRate() { ... }

    async getQualities() { ... }

    async setQuality(q) { ... }

    get currentQuality() { ... }

    async getDimensions() { ... }

    // This function is called when the player loads, and it should
    // make everything ready for video playback to begin.
    async loadStreamData(streamData) { ... }
}

...
```

## Video plugin

```javascript
import VideoPlugin, { Video } from 'paella/core/VideoPlugin';

... MyVideoPlayer definition

export default class MyVideoPlugin extends VideoPlugin {
    get streamType() {
        return "streamType";
    }

    async isCompatible() {
        return true;
    }

    async getVideoInstance(playerContainer) {
        new MyVideoPlayer()
    }
}
```
