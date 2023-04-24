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
1. Create an scs file in `./src/templates` using `#VAR_NAME#` as variables.
2. Create an interface for the new template in `./src/types.ts` and describe the yaml configuration file for the new template.
3. Describe the replacement rules in `./src/replacements.ts`.

## Template syntax
Template scs files have 3 types of variables:
1. Single variable:
```scs
concept_#SINGLE# -> ...;
⇓ ⇓ ⇓
concept_scs_automation -> ...;
```

2. Line variable:
```scs
- concept_#LINE# -> ...;
⇓ ⇓ ⇓
concept_one -> ...;
concept_two -> ...;
concept_three -> ...;
```

3. Block variable:
```scs
+ /* #BLOCK# */
+ concept_#SYSTEM#
+ => nrel_main_idtf:
+   [#RU#] (* <- lang_ru;; *);
+   [#EN#] (* <- lang_en;; *);;

⇓ ⇓ ⇓

concept_one
=> nrel_main_idtf:
  [Один] (* <- lang_ru;; *);
  [One] (* <- lang_en;; *);;

concept_two
=> nrel_main_idtf:
  [Два] (* <- lang_ru;; *);
  [Two] (* <- lang_en;; *);;

concept_three
=> nrel_main_idtf:
  [Три] (* <- lang_ru;; *);
  [Three] (* <- lang_en;; *);;

```

Note that the additional syntax constructions of scs template files do not break the scs syntax highlight provided by SCs language server.
