import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	indentWidth: number;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	indentWidth: 55
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownPostProcessor(async (element, c) => {
			let text = element.textContent ?? "";
			let lines = text.split('\n', Number.MAX_SAFE_INTEGER);
			let out = createDiv({text: ""});
			for (let line of lines) {
				out.appendChild(createDiv({text: line, attr: {style: `text-indent:${this.settings.indentWidth}px`}}))
			}
			element.replaceChildren(out);
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Indent Width')
			.addText(text => text
				.setValue("" + this.plugin.settings.indentWidth)
				.onChange(async (value) => {
					this.plugin.settings.indentWidth = Number.parseInt(value);
					await this.plugin.saveSettings();
				}));
	}
}
