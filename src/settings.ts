import { App, PluginSettingTab, Setting } from "obsidian";
import SpotifyControllerPlugin from "./main";

export interface SpotifySettings {
  accessToken: string;
}

export const DEFAULT_SETTINGS: SpotifySettings = {
  accessToken: ""
};

export class SpotifySettingTab extends PluginSettingTab {
  plugin: SpotifyControllerPlugin;

  constructor(app: App, plugin: SpotifyControllerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Spotify authentication")
      .setHeading();

    new Setting(containerEl)
      .setName("Access token")
      .setDesc("Paste your Spotify access token here.")
      .addText((text) =>
        text
          .setPlaceholder("Spotify access token")
          .setValue(this.plugin.settings.accessToken)
          .onChange(async (value) => {
            this.plugin.settings.accessToken = value;
            await this.plugin.saveSettings();
          })
      );
  }
}