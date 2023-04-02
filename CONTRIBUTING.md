# Contributing to scs-action
👋 Hi there! Thanks for coming here and contributing to scs-action, your help is very valuable!

## How do I contribute
- Create an issue for bug or feature request.
- Comment an existing issue to say that you are tackling it.
- Create a pull request fixing a bug or implementing a feature described in an issue.
- ⭐ Support the project by giving it a star.

## Development
- Make sure you have **node 16 or higher** installed.
- Install the dependencies by `npm i`.
- Make sure to run `npm run all` before pushing changes to a pull request.

## Adding a new scs template
1. Create an scs file in `./templates` using `#VAR_NAME#` as variables.
2. Create an interface for the new template in `./src/types.ts` and describe the sc.yaml configuration file for the new template.
3. Describe the replacement rules in `./src/replacements.ts`.
