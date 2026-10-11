# Old Rivingtonians Under 13s Team Hub

A public, read-only hub for team fixtures, results, league standings, and approved player
statistics.

## Data workflow

Fixtures, results, and standings are maintained in
`src/data/generated/team-hub-data.json`. Copy the club-approved information from the league source
into that file, preserving its field names and ISO dates. Set an unavailable section to an empty
array with a public-safe `statusMessage`; never represent missing information as zero.

Player statistics are maintained in `src/data/player-stats.json`. Only approved display names and
aggregate appearances, goals, and assists may be added. Do not add contact details, dates of birth,
or other personal information.

## Static data update format

Share pasted data in these sections and it can be normalized for the hub:

```text
Fixtures: date, time, opponent, home/away, venue, status
Results: date, opponent, Old Rivingtonians score, opponent score
Table: position, team, played, points, goal difference
```

Dates need a year; times and venues can be omitted when unavailable. The team row in a league table
is highlighted automatically once marked as the Under 13s row.

## Commands

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
```
# Updating team data

Edit only `src/data/local-team-update.json`, then run:

```sh
npm run publish:local-data
```

The command validates every match, contribution, league-table entry, and approved player statistic
before atomically replacing the public data files. Invalid updates leave the live snapshot unchanged.
