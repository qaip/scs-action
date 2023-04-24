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

Starting `v3.2` we have introduced [strongly typed schemas](#schemas) for interactive highlights and annotations, code snippets, autocompletion and extremely strict validation! This further enhances the benefits offered by this project, as it:
  - Significantly improves the developer experience
  - Eliminates the possibility of any syntax or language error during the build process

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
      - uses: qaip/scs-action@v3
```
Now whenever configuration `.yaml` files are pushed or changed within a pull request, the corresponding `.scs` files will be generated or updated accordingly.

### About configuration yaml files
Source files describing fragments of a knowledge base must have the `<type>.yaml` or `<type>.yml` extension, where `<type>` defines the type of the knowledge base fragment. See [tempaltes](#tempaltes) for more information about available types.

The name of the configuration file is used as a part of the main system identifier of the knowledge base fragment.

Each configuration file type has a different set of fields defining the knowledge base fragment, however, there are certain common value types that are used among all configuration files and are also mentioned in annotations:

- Pipe-separated string (called `Set`):

  ```yaml
  en: First | Second | Third
  ```

- Multiline string (called `List`):

  ```yaml
  en: |
    First
    Second
    Third
  ```

- Collection (called `Array`):
  ```yaml
  en:
    - First
    - Second
    - Third
  ```


### Additional options
There are several additional options available for scs-action:
- `github_token` — custom GitHub token (by default `github.token` is used).
- `ignore_empty` — whether to ignore empty files (either `never` or `always`, default is `never`).

Example:
```yaml
- uses: qaip/scs-action@v2
  with:
    ignore_empty: always
```



## Templates
The currently supported knowledge base fragment types (called templates) are described below. If you need a new template, please leave the corresponding request by creating an issue (see [contributing](#contributing)).

### Subject Domain
Matching extension: `.domain.yaml`
```rb
en: String
ru: String
parent: String
children: List # optional
max: List
concepts: List # optional
rrels: List # optional
nrels: List # optional
```
**Example**:
[**Input**](tests/ostis_automation.domain.yaml)
->
[**Output**](tests/expect/domain_ostis_automation.scs)


### Semantic Neighbourhood of Concept
Matching extension: `.concept.yaml`
```rb
ru: Set | Array
en: Set | Array
definition:
  ru: String | Array
  en: String | Array
  using:
    concepts: List # optional
    nrels: List # optional
    rrels: List # optional
statement: 
  one:
    title:
      ru: String
      en: String
    ru: String | Array
    en: String | Array
    using:
      concepts: List # optional
      nrels: List # optional
      rrels: List # optional
  two:
    ...
```
**Example:** 
[**Input**](tests/scs_automation.concept.yaml)
->
[**Output**](tests/expect/concept_scs_automation.scs)


## Schemas
### VSCode
1. Make sure you have [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) extension installed.
2. Go to vscode settings, search for `yaml.schemas`, click "Edit in settings.json" and paste the following lines:
```json
"yaml.schemas": {
  "https://raw.githubusercontent.com/qaip/scs-action/v3/schemas/concept.schema.json": "*.concept.yaml",
  "https://raw.githubusercontent.com/qaip/scs-action/v3/schemas/domain.schema.json": "*.domain.yaml"
}
```

### PyCharm
1. Go to `Settings` > `Languages & Frameworks` > `Schemas and DTDs` > `JSON Schema Mappings`.
2. Set up the same mappings as for vscode (see above).

## Contributing
- Feel free to open issues and request new templates and features.
- Any contributions you make are truly appreciated.
- Check out our [contribution guidelines](CONTRIBUTING.md) for more information.


## License
This project is licensed under the [MIT License](LICENSE).
