# 1.6.7 (2024-11-21)

- up: search-insights.js updated to ([2.17.3](https://github.com/algolia/search-insights.js/releases/tag/v2.17.3))

# 1.6.6 (2024-08-02)

- feat: support setting `host` in `init` method ([#41](https://github.com/algolia/search-insights-gtm/pull/41))

# 1.6.5 (2024-05-28)

- feat: allow escaped commas and add tests ([#40](https://github.com/algolia/search-insights-gtm/pull/40))

# 1.5.5 (2024-05-22)

- fix: never skip init ([#39](https://github.com/algolia/search-insights-gtm/pull/39))

# 1.5.4 (2024-04-10)

- fix: don't log debug statement if objectData is undefined ([#36](https://github.com/algolia/search-insights-gtm/pull/36))

# 1.5.3 (2024-04-08)

- fix: don't fail on a second init, bump search-insights to 2.13.0 ([#34](https://github.com/algolia/search-insights-gtm/pull/34))

# 1.5.2 (2024-02-22)

- fix: enable objectData to be specified as a simple text field ([#32](https://github.com/algolia/search-insights-gtm/pull/32))
- fix: minor code style issues ([#33](https://github.com/algolia/search-insights-gtm/pull/33))

# 1.5.1 (2024-01-11)

- fix: ensure that event options can be specified for viewedObjectIDs and viewedFilters ([#30](https://github.com/algolia/search-insights-gtm/pull/30))

# 1.5.0 (2023-12-04)

- feat: support authenticated user tokens ([#25](https://github.com/algolia/search-insights-gtm/pull/25))
- feat: add objectData support ([#22](https://github.com/algolia/search-insights-gtm/pull/22))
- feat: add value and currency support for conversion events ([#20](https://github.com/algolia/search-insights-gtm/pull/20))
- feat: add eventSubtype propagation to conversion events ([#18](https://github.com/algolia/search-insights-gtm/pull/18))

# 1.4.1 (2023-10-10)

- fix: update logo

# 1.4.0 (2023-09-07)

- fix: bump search-insights.js to 2.7.0

# 1.3.1 (2022-05-25)

- fix: bump search-insights.js to 2.2.1

# 1.3.0 (2022-05-09)

- fix: allow number in formatValueToList ([#14](https://github.com/algolia/search-insights-gtm/pull/14))
- feat: chunk events with items exceeding limits ([#13](https://github.com/algolia/search-insights-gtm/pull/13))
- fix: use iife in case requirejs is included in customers' website ([#12](https://github.com/algolia/search-insights-gtm/pull/12))

# 1.2.1 (2021-11-08)

- fix: return array if it's already an array ([#11](https://github.com/algolia/search-insights-gtm/pull/11))

# 1.2.0 (2021-10-15)

Upgrade search-insights to v2.0.4 which no longer validates event payloads. You can visit https://algolia.com/events/debugger instead.

# 1.2.0 (2021-10-07)

Allow `useCookie` paramter for Initialization method (`true` by default)

# 1.1.0 (2021-07-30)

Support `useCookie: boolean` parameter in the `Init` method.

# 1.0.2 (2021-04-01)

Rename the group sections without space as it seems to break their display within the UI.

# 1.0.0 (2019-09-21)

Initial release.
