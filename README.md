# scs-action

[![Tests](https://github.com/qaip/scs-action/actions/workflows/tests.yml/badge.svg)](https://github.com/qaip/scs-action/actions/workflows/tests.yml)
[![Build check](https://github.com/qaip/scs-action/actions/workflows/build-check.yml/badge.svg)](https://github.com/qaip/scs-action/actions/workflows/build-check.yml)


Say no to manual writing assembly-like SC-code! Generate *formatted and neat* SCs on the fly.


## Motivation
Many of the scs files actually contain quite a lot of boilerplate code with many duplicates. In addition to this, there are extremely many ways in which one can describe a concept or a subject domain. There is no formatter, nor a linter for scs files. **This project solves all these problems at once:**
- The minimum possible amount of code.
- Easy to read.
- Focus on what you need, do not get distracted by complex syntax and semantics.
- Get neat and uniformly formatted ready-to-use scs files generated on the fly.


## Usage
### Minimal example
In your GitHub project, create a file `.github/workflows/update-scs.yml`:
```yaml
name: SCs Automation

on: pull_request

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: qaip/scs-action@v2
```
Now whenever `.sc.yaml` files are pushed or changed within a pull request, the corresponding `.scs` files will be generated or updated accordingly.

### About sc.yaml files
Source files describing fragments of a knowledge base must have the `sc.yaml` or `sc.yml` extension. The key field defining the template type is called `type`. All other fields are defined based on the specified template type.

Single line string (called `string`):
```yaml
en: English Main Idtf
``` 
Multiline string (called `list`):
```yaml
en: |
  English Main Idtf
  English Idtf
```



### Additional options
There are several options available for scs-action:
- `github_token` — custom GitHub token (by default `github.token` is used).
- `ignore_empty` — whether to ignore empty files (either `never` or `always`, default is `never`).

Example:
```yaml
- uses: qaip/scs-action@v2
  with:
    ignore_empty: always
```



## Templates
The currently supported templates are described below. If you need a new template, leave the corresponding request by creating an issue (see [contributing](#contributing)).

### Subject Domain
```ts
type: 'domain'
system: string
en: string
ru: string
parent: string
children: list // optional
max: list
concepts: list
rrels: list // optional
nrels: list // optional
```
**Example:** 
[**Input**](https://github.com/qaip/gt/blob/main/Graphs/Simple%20Graphs/simple_graphs.sc.yaml)
->
[**Output**](https://github.com/qaip/gt/blob/main/Graphs/Simple%20Graphs/domain_simple_graphs.scs)


## Contributing
- Feel free to open issues and request new templates and features.
- Any contributions you make are truly appreciated.
- Check out our [contribution guidelines](CONTRIBUTING.md) for more information.


## License
This project is licensed under the [MIT License](LICENSE).
