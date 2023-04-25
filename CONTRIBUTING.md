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
### Variables
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

### Optional blocks
Optional blocks are used when the variables defined inside the blocks may not be specified by users. In this case, the entire block should be removed. Here is an example demonstrating the problem:
```scs
-> rrel_explored_relation:
- 	nrel_#NRELS#;
- 	rrel_#RRELS#;

sc_node_class -> concept_hello

⇓ ⇓ ⇓

-> rrel_explored_relation:
sc_node_class -> concept_hello
```
In the above example, having no `NRELS` and `RRELS` specified will lead to invalid scs syntax construction. That's where optional blocks come. Optional blocks are defined similarly to line or block variables:
```scs
? -> rrel_explored_relation:
- 	nrel_#NRELS#;
- 	rrel_#RRELS#;

sc_node_class -> concept_hello

⇓ ⇓ ⇓

sc_node_class -> concept_hello
```
A more complex example may look like:
```scs
+ /* #STATEMENT# */
+ statement -> statement_of_#STATEMENT_SYSTEM# (*
+ 	-> rrel_key_sc_element: concept_#SYSTEM#;;
+ 
+ ? 	<- concept_has_translation;;
+ ? 	<= nrel_sc_text_translation: ... (*
+ - 		-> [#STATEMENT_RU#] (* <- lang_ru;; *);;
+ - 		-> [#STATEMENT_EN#] (* <- lang_en;; *);;
+ ? 	*);;
+ *);;
```
Note that optional blocks can be of any size, and therefore, they **must** begin and end with an empty line. The only exception is if the block ends with a line that starts with a closing bracket (see example above).

### Semicolons
You may notice that in case multiple line-variables (lists) are passed to a block, in different situations we may or may not want to append an extra semicolon to the last element of the last list:
```scs
concept_fruit ->
- concept_#RED#;
- concept_#GREEN#;  <- Extra semicolon is not needed
concept_lemon;;

concept_dog ->
- concept_#DOGS#;;  <- Extra semicolon is needed, but for the last element only

concept_car ->
- concept_#CARS#;  <- Append semicolon to the last element of this list if FREIGHT_CARS is empty
- concept_#FREIGHT_CARS#;;

my_set -> {
- 	concept_#ELEMENTS#;  <- Now we need to delete an extra semicolon of the last element
}
```

For this reason, we introduce a special keyword `#END#` that indicates the end of the list and the need to set a custom number of semicolons to the last element of the last list (if such exists):
```scs
concept_fruit ->
- concept_#RED#;
- concept_#GREEN#;
concept_lemon;;

concept_dog ->
- concept_#DOGS#;
- #END#;;

concept_car ->
- concept_#CARS#;
- concept_#FREIGHT_CARS#;
- #END#;;

my_set -> {
- 	concept_#ELEMENTS#;
- 	#END#
}
```

### Floating semicolons
The floating semicolons for list variables are defined in the same way as usual semicolons with the only difference: there must be an empty new line before the `#END#` keyword. The difference between normal semicolons and floaing ones is that the floating semicolon is moved to another existing block if the previous one got deleted:
```
subject_domain_of_#SYSTEM#
<= nrel_private_subject_domain:
	subject_domain_of_#PARENTS#;

? => nrel_private_subject_domain:
- 	subject_domain_of_#CHILDREN#;

- 	#END#;;
```
In the example above, the extra semicolon will be added to the last element of the `CHILDREN` list in case it exists, and to the last element of the `PARENTS` list otherwise.



<br>

**Happy hacking! ✌️**
