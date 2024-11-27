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

The `version` property in [`package.json`](package.json) should be incremented for each change (e.g. run the `yarn version <major|minor|patch>` command). This value is used to send usage metrics to Algolia.

To release a new version:

- Run the `build` command to update the [generated template](./template.tpl)
- Commit the change (`git commit -m "chore: update version to vx.y.z"`)
- Run the `release` command to update `metadata.yml` file with the commit SHA.
- Update the [changelog](CHANGELOG.md) manually (and probably `changeNotes` in `metadata.yml` as well)
- Commit it to GitHub

For users to update the template, they need to download it again and to reimport it in the GTM interface (they won't lose their configuration).

## Credits

Thanks to [David Vallejo](https://www.thyngster.com/) for his initial work on the custom template.

## License

Apache 2.0 - See [LICENSE](/LICENSE) for more information.
