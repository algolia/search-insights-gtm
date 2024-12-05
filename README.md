# Search Insights for Google Tag Manager (GTM)

Google Tag Manager connector for Algolia Search Insights.

## Documentation

Head over our [**Getting Insights and Analytics / Google Tag Manager**](https://www.algolia.com/doc/guides/getting-insights-and-analytics/connectors/google-tag-manager/) documentation.

## Contributing

Before working on the project, make sure to **disable any ad blockers**.

### Folder structure

The source for the GTM template is in the [`src/`](src) folder and gets exported to the `./template.tpl` file.

### Commands

#### `build`

> Builds the GTM template into the `./template.tpl` file.

Each section of the custom template is in the [`src/`](src) folder. This command compiles the files into a GTM template.

#### `dev`

> Runs the [`build`](#build) command in watch mode.

### Releasing

Run `yarn run release` to prepare the release (this command is also executed weekly). When this is run the commit messages are read and based on their content:
- a branch is created
- the `version` property in [`package.json`](package.json) is updated
- [`CHANGELOG.md`](CHANGELOG.md) is updated
- a PR is raised with this content

To trigger the release "Squash and merge" the PR.

## Credits

Thanks to [David Vallejo](https://www.thyngster.com/) for his initial work on the custom template.

## License

Apache 2.0 - See [LICENSE](/LICENSE) for more information.
