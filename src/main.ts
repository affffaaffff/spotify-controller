import { Plugin, WorkspaceLeaf } from "obsidian";
import { NowPlayingView, VIEW_TYPE_SPOTIFY } from "./nowplaying";
import { SpotifySettingTab, SpotifySettings, DEFAULT_SETTINGS } from "./settings";

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

    this.addCommand({
      id: "open-spotify-controller",
      name: "Open Spotify controller",
      callback: () => {
        void this.activateView();
      }
    });

    this.addSettingTab(new SpotifySettingTab(this.app, this));
  }

  onunload(): void {
    console.debug("Spotify controller unloaded");
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