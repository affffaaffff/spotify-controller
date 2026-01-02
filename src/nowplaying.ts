import { ItemView, WorkspaceLeaf, Setting, requestUrl } from "obsidian";
import SpotifyControllerPlugin from "./main";

export const VIEW_TYPE_SPOTIFY = "spotify-controller-view";

export class NowPlayingView extends ItemView {
  private plugin: SpotifyControllerPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: SpotifyControllerPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_SPOTIFY;
  }

  getDisplayText(): string {
    return "Spotify controller";
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl;
    container.empty();

    new Setting(container)
      .setName("Playback")
      .setHeading();

    const controls = container.createDiv("spotify-controls");

    const playPauseButton = controls.createEl("button", {
      text: "Play / pause"
    });

    playPauseButton.addEventListener("click", () => {
      void this.togglePlayback();
    });

    const nextButton = controls.createEl("button", {
      text: "Next track"
    });

    nextButton.addEventListener("click", () => {
      void this.nextTrack();
    });

    const previousButton = controls.createEl("button", {
      text: "Previous track"
    });

    previousButton.addEventListener("click", () => {
      void this.previousTrack();
    });
  }

  async togglePlayback(): Promise<void> {
    await this.spotifyRequest("https://api.spotify.com/v1/me/player/play", "PUT");
  }

  async nextTrack(): Promise<void> {
    await this.spotifyRequest("https://api.spotify.com/v1/me/player/next", "POST");
  }

  async previousTrack(): Promise<void> {
    await this.spotifyRequest("https://api.spotify.com/v1/me/player/previous", "POST");
  }

  async spotifyRequest(url: string, method: string): Promise<void> {
    try {
      await requestUrl({
        url,
        method,
        headers: {
          Authorization: `Bearer ${this.plugin.settings.accessToken}`
        }
      });
    } catch (error) {
      console.error("Spotify request failed", error);
    }
  }
}