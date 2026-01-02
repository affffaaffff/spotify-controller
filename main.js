"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SpotifyControllerPlugin3
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/nowplaying.ts
var import_obsidian = require("obsidian");
var VIEW_TYPE_SPOTIFY = "spotify-controller-view";
var NowPlayingView = class extends import_obsidian.ItemView {
  plugin;
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_SPOTIFY;
  }
  getDisplayText() {
    return "Spotify controller";
  }
  async onOpen() {
    const container = this.containerEl;
    container.empty();
    new import_obsidian.Setting(container).setName("Playback").setHeading();
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
  async togglePlayback() {
    await this.spotifyRequest(
      "https://api.spotify.com/v1/me/player/play",
      "PUT"
    );
  }
  async nextTrack() {
    await this.spotifyRequest(
      "https://api.spotify.com/v1/me/player/next",
      "POST"
    );
  }
  async previousTrack() {
    await this.spotifyRequest(
      "https://api.spotify.com/v1/me/player/previous",
      "POST"
    );
  }
  async spotifyRequest(url, method) {
    try {
      await (0, import_obsidian.requestUrl)({
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
};

// src/settings.ts
var import_obsidian2 = require("obsidian");
var DEFAULT_SETTINGS = {
  accessToken: ""
};
var SpotifySettingTab = class extends import_obsidian2.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian2.Setting(containerEl).setName("Spotify authentication").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Access token").setDesc("Paste your Spotify access token here.").addText(
      (text) => text.setPlaceholder("Spotify access token").setValue(this.plugin.settings.accessToken).onChange(async (value) => {
        this.plugin.settings.accessToken = value;
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/main.ts
var SpotifyControllerPlugin3 = class extends import_obsidian3.Plugin {
  settings;
  async onload() {
    console.debug("Loading Spotify controller");
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.registerView(
      VIEW_TYPE_SPOTIFY,
      (leaf) => new NowPlayingView(leaf, this)
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
  onunload() {
    console.debug("Spotify controller unloaded");
  }
  async activateView() {
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
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
