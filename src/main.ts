import { Plugin, WorkspaceLeaf } from "obsidian";
import { NowPlayingView, VIEW_TYPE_SPOTIFY } from "./nowplaying";
import { SpotifySettings, DEFAULT_SETTINGS } from "./settings";

export default class SpotifyControllerPlugin extends Plugin {
  settings: SpotifySettings;

  async onload(): Promise<void> {
    console.debug("Loading Spotify controller");

    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    this.registerView(
      VIEW_TYPE_SPOTIFY,
      (leaf: WorkspaceLeaf) => new NowPlayingView(leaf, this)
    );

    this.addRibbonIcon("music", "Spotify controller", () => {
      void this.activateView();
    });
  }

  onunload(): void {
    console.debug("Unloading Spotify controller");
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;

    let leaf = workspace.getLeavesOfType(VIEW_TYPE_SPOTIFY)[0];

    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({
        type: VIEW_TYPE_SPOTIFY,
        active: true
      });
    }

    workspace.revealLeaf(leaf);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}