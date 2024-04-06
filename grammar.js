module.exports = grammar({
    name: 'gtl',
    // extras: $ => [
    //   $.generated_c,
    // ],

    conflicts: $ => [
      // [$.source_file],
      // [$.gtl_template_instruction_list],
      // [$.identifier_string],
      [$.gtl_factor],
      [$.gtl_simple_expression],
      // [$.gtl_template_instruction],
      [$.gtl_variable],
      [$.literal_char, $.string],
      [$.literal_enum, $.identifier_string]
    ],

    extras: $ => [
      $.comment,
      /\s|\\\r?\n/
      // $.generated_c
    ],

    rules: {
      source_file: $ => seq(
        $.generated_c,
        repeat1(
          choice(
            seq(
              "%",
              $.source_template
            ),
            seq(
              "%",
              $.source_template,
              "%"
            ),
            seq(
              "%",
              $.source_template,
              "%",
              $.generated_c
            ),
            seq(
              "%",
              $.source_template,
              "%",
              $.generated_c,
              "%"
            ),
          )
        )
        // $.generated_c,
        // "%",
        // $.template,
        // repeat(
        //   seq(
        //     '%',
        //     $.generated_c,
        //     $.template,
        //   )
        // ),
        // optional('%')
      ),

      // template: $ => /%([^%]*)%/,

      template: $ => seq(
        // token("%"),
        $.source_template,
        // token("%"),
      ),

      generated_c: _ => /[^%]*/,
      // generated_c: _ => token(/[^%]*[^%]+/),

      // test_c: _ => token(/\%\w*\%[^{}]+/),

      source_template: $ => seq(
          repeat($.gtl_import),
          $.gtl_template_instruction_list
      ),

      gtl_import: $ => seq(
        'import',
        $.string
      ),

      gtl_template_instruction_list: $ => repeat1(
        choice(
          $.gtl_simple_instruction,
          $.gtl_template_instruction
        )
      ),

      // gtl_template_instruction_list: $ => choice(
      //   seq(
      //     $.gtl_simple_instruction,
      //     optional($.gtl_template_instruction_list)
      //   ),
      //   seq(
      //     $.gtl_template_instruction,
      //     optional($.gtl_template_instruction_list)
      //   )
      // ),

      gtl_simple_instruction: $ => choice(
        $.gtl_let_simple_instruction,
        $.gtl_unlet_simple_instruction,
        $.gtl_error_simple_instruction,
        $.gtl_warning_simple_instruction,
        $.gtl_print_simple_instruction,
        $.gtl_println_simple_instruction,
        $.gtl_seed_simple_instruction,
        $.gtl_display_simple_instruction,
        $.gtl_sort_simple_instruction,
        $.gtl_tab_simple_instruction,
        $.gtl_variables_simple_instruction,
        $.gtl_librairies_simple_instruction,
        $.gtl_brackets_simple_instruction
      ),

      gtl_let_simple_instruction: $ => seq(
        'let',
        $.gtl_variable,
        choice(
          seq(
            ':=',
            $.gtl_expression
          ),
          seq(
            '+=',
            $.gtl_expression
          ),
          seq(
            '-=',
            $.gtl_expression
          ),
          seq(
            '*=',
            $.gtl_expression
          ),
          seq(
            '/=',
            $.gtl_expression
          ),
          seq(
            'mod=',
            $.gtl_expression
          ),
          seq(
            '<<=',
            $.gtl_expression
          ),
          seq(
            '>>=',
            $.gtl_expression
          ),
          seq(
            '&=',
            $.gtl_expression
          ),
          seq(
            '|=',
            $.gtl_expression
          ),
          seq(
            '^=',
            $.gtl_expression
          )
        )
      ),

      gtl_unlet_simple_instruction: $ => seq(
        'unlet',
        $.gtl_variable
      ),

      gtl_error_simple_instruction: $ => seq(
        'error',
        $.gtl_variable_or_here,
        ':',
        $.gtl_expression
      ),

      gtl_warning_simple_instruction: $ => seq(
        'warning',
        $.gtl_variable_or_here,
        ':',
        $.gtl_expression
      ),

      gtl_print_simple_instruction: $ => seq(
        'print',
        $.gtl_expression
      ),

      gtl_println_simple_instruction: $ => seq(
        'println',
        optional(
          $.gtl_expression
        )
      ),

      gtl_seed_simple_instruction: $ => seq(
        'seed',
        optional(
          $.gtl_expression
        )
      ),

      gtl_display_simple_instruction: $ => seq(
        'display',
        $.gtl_variable
      ),

      gtl_sort_simple_instruction: $ => seq(
        'sort',
        $.gtl_variable,
        choice(
          $.gtl_sorting_order,
          seq(
            'by',
            repeat1(
              seq(
                $.identifier_string,
                $.gtl_sorting_order,
                optional(',')
              )
            )
          )
        )
      ),

      gtl_tab_simple_instruction: $ => seq(
        'tab',
        $.gtl_expression
      ),

      gtl_variables_simple_instruction: $ => (
        'variables'
      ),

      gtl_librairies_simple_instruction: $ => (
        'librairies'
      ),

      gtl_brackets_simple_instruction: $ => seq(
        '[!',
        $.gtl_variable,
        $.identifier_string,
        optional(
          seq(
            ':',
            repeat1(
              seq(
                $.gtl_expression,
                optional(
                  ','
                )
              )
            )
          )
        ),
        ']'
      ),

      gtl_variable: $ => seq(
        $.identifier_string,
        choice(
          optional(
            seq(
              '::',
              $.gtl_variable
            )
          ),
          optional(
            seq(
              '[',
              $.gtl_expression,
              ']',
              optional(
                repeat1(
                  seq(
                    '[',
                    $.gtl_expression,
                    ']'
                  )
                )
              )
            ),
          )
        )
      ),

      gtl_expression: $ => seq(
        $.gtl_relation_term,
        repeat(
          choice(
            seq(
              '^',
              $.gtl_relation_term
            ),
            seq(
              '|',
              $.gtl_relation_term
            )
          )
        )
      ),

      gtl_relation_term: $ => seq(
        $.gtl_relation_factor,
        repeat(
          seq(
            '&',
            $.gtl_relation_factor
          )
        )
      ),

      gtl_relation_factor: $ => seq(
        $.gtl_simple_expression,
        repeat(
          choice(
            seq(
              '==',
              $.gtl_simple_expression
            ),
            seq(
              '!=',
              $.gtl_simple_expression
            ),
            seq(
              '<=',
              $.gtl_simple_expression
            ),
            seq(
              '>=',
              $.gtl_simple_expression
            ),
            seq(
              '>',
              $.gtl_simple_expression
            ),
            seq(
              '<',
              $.gtl_simple_expression
            )
          )
        )
      ),

      gtl_simple_expression: $ => seq(
        $.gtl_term,
        repeat(
          choice(
            seq(
              '<<',
              $.gtl_term
            ),
            seq(
              '>>',
              $.gtl_term
            ),
            seq(
              '+',
              $.gtl_term
            ),
            seq(
              '.',
              $.gtl_term
            ),
            seq(
              '-',
              $.gtl_term
            )
          )
        )
      ),

      gtl_term: $ => seq(
        $.gtl_factor,
        repeat(
          choice(
            seq(
              '*',
              $.gtl_factor
            ),
            seq(
              '/',
              $.gtl_factor
            ),
            seq(
              'mod',
              $.gtl_factor
            )
          )
        )
      ),

      gtl_factor: $ => choice(
        seq(
          '(',
          $.gtl_expression,
          ')'
        ),
        seq(
          'not',
          $.gtl_factor
        ),
        seq(
          '~',
          $.gtl_factor
        ),
        seq(
          '-',
          $.gtl_factor
        ),
        seq(
          '+',
          $.gtl_factor
        ),
        'yes',
        'no',
        // $.signed_literal_integer_bigint,
        $.literal_double,
        $.string,
        $.literal_char,
        seq(
          '[',
          $.gtl_expression,
          $.identifier_string,
          optional(
            seq(
              ':',
              repeat1(
                seq(
                  $.gtl_expression,
                  optional(
                    ','
                  )
                )
              )
            )
          ),
          ']'
        ),
        seq(
          $.gtl_variable,
          optional(
            seq(
              '(',
              repeat(
                seq(
                  $.gtl_expression,
                  ','
                )
              ),
              ')'
            )
          )
        ),
        seq(
          'exists',
          $.gtl_variable,
          optional(
            seq(
              'default',
              '(',
              $.gtl_expression,
              ')'
            )
          )
        ),
        seq(
          'typeof',
          $.gtl_variable
        ),
        'true',
        'false',
        $.literal_enum,
        seq(
          '@',
          $.identifier_string
        ),
        'emptylist',
        'emptymap',
        seq(
          'mapof',
          $.gtl_expression,
          choice(
            'end',
            seq(
              'by',
              $.identifier_string
            )
          )
        ),
        seq(
          'listof',
          $.gtl_expression,
          'end'
        ),
        seq(
          '@(',
          repeat(
            choice(
              seq(
                $.gtl_expression
              ),
              seq(
                $.gtl_expression,
                ","
              )
            )
            // seq(
            //   $.gtl_expression,
            //   optional(
            //     ','
            //   )
            // )
          ),
          ')'
        ),
        seq(
          '@[',
          repeat(
            seq(
              $.string,
              ':',
              $.gtl_expression,
              optional(
                ','
              )
            )
          ),
          ']'
        ),
        seq(
          '@{',
          repeat(
            seq(
              $.identifier_string,
              ':',
              $.gtl_expression,
              optional(
                ','
              )
            )
          ),
          '}'
        ),
        seq(
          '@!',
          repeat(
            seq(
              $.gtl_expression,
              optional(
                ','
              )
            )
          ),
          '!'
        ),
        seq(
          '@?',
          $.gtl_expression,
          '?'
        ),
        '__VARS__'
      ),

      gtl_expression: $ => seq(
        $.gtl_relation_term,
        repeat(
          choice(
            seq(
              '^',
              $.gtl_relation_term
            ),
            seq(
              '|',
              $.gtl_relation_term
            )
          )
        )
      ),

      gtl_relation_term: $ => seq(
        $.gtl_relation_factor,
        repeat(
          seq(
            '&',
            $.gtl_relation_factor
          )
        )
      ),

      gtl_sorting_order: $ => choice(
        '<',
        '>'
      ),

      gtl_variable_or_here: $ => choice(
        'here',
        $.gtl_variable
      ),

      gtl_template_instruction: $ => choice(
        $.gtl_exclamation_instruction,
        $.gtl_write_instruction,
        $.gtl_template_template_instruction,
        $.gtl_interrogation_instruction,
        $.gtl_if_instruction,
        $.gtl_foreach_instruction,
        $.gtl_for_instruction,
        $.gtl_loop_instruction,
        $.gtl_repeat_instruction,
        $.gtl_input_instruction
      ),

      gtl_exclamation_instruction: $ => seq(
        '!',
        $.gtl_expression
      ),

      gtl_write_instruction: $ => seq(
        'write',
        'to',
        optional(
          'executable'
        ),
        $.gtl_expression,
        ':',
        optional($.gtl_template_instruction_list),
        'end',
        'write'
      ),

      gtl_template_template_instruction: $ => seq(
        'template',
        optional(
          seq(
            '(',
            optional(
              repeat1(
                seq(
                  $.gtl_expression,
                  optional(
                    ','
                  )
                )
              )
            ),
            ')'
          )
        ),
        choice(
          seq(
            $.gtl_file_name,
            optional(
              seq(
                'in',
                $.identifier_string
              )
            )
          ),
          seq(
            'if',
            'exists',
            $.gtl_file_name,
            optional(
              seq(
                'in',
                $.identifier_string
              )
            ),
            optional(
              seq(
                'or',
                optional($.gtl_template_instruction_list),
                'end',
                'template'
              )
            )
          )
        )
      ),

      gtl_interrogation_instruction: $ => seq(
        '?',
        $.gtl_variable
      ),

      gtl_if_instruction: $ => seq(
        'if',
        seq(
          $.gtl_expression,
          'then',
          optional($.gtl_template_instruction_list)
        ),
        choice(
          repeat(
            seq(
              'elsif',
              $.gtl_expression,
              'then',
              optional($.gtl_template_instruction_list)
            )
          ),
          repeat(
            seq(
              'else',
              optional($.gtl_template_instruction_list)
            )
          )
        ),
        'end',
        'if'
      ),

      gtl_foreach_instruction: $ => seq(
        'foreach',
        $.identifier_string,
        optional(
          seq(
            ',',
            $.identifier_string
          )
        ),
        optional(
          seq(
            '(',
            $.identifier_string,
            ')'
          )
        ),
        'in',
        $.gtl_expression,
        optional(
          seq(
            'before',
            optional($.gtl_template_instruction_list)
          )
        ),
        'do',
        optional($.gtl_template_instruction_list),
        optional(
          seq(
            'between',
            optional($.gtl_template_instruction_list)
          )
        ),
        optional(
          seq(
            'after',
            optional($.gtl_template_instruction_list)
          )
        ),
        'end',
        'foreach'
      ),

      gtl_for_instruction: $ => seq(
        'for',
        $.identifier_string,
        'in',
        repeat1(
          seq(
            $.gtl_expression,
            optional(',')
          )
        ),
        'do',
        optional($.gtl_template_instruction_list),
        optional(
          seq(
            'between',
            optional($.gtl_template_instruction_list)
          )
        ),
        'end',
        'for'
      ),

      gtl_loop_instruction: $ => seq(
        'loop',
        $.identifier_string,
        'from',
        $.gtl_expression,
        optional(
          choice(
            'up',
            'down'
          )
        ),
        'to',
        $.gtl_expression,
        optional(
          seq(
            'step',
            $.gtl_expression
          )
        ),
        optional(
          seq(
            'before',
            optional($.gtl_template_instruction_list)
          )
        ),
        'do',
        optional($.gtl_template_instruction_list),
        optional(
          seq(
            'between',
            optional($.gtl_template_instruction_list)
          )
        ),
        optional(
          seq(
            'after',
            optional($.gtl_template_instruction_list)
          )
        ),
        'end',
        'loop'
      ),

      gtl_repeat_instruction: $ => seq(
        'repeat',
        optional(
          seq(
            '(',
            $.gtl_expression,
            ')'
          )
        ),
        optional($.gtl_template_instruction_list),
        'while',
        $.gtl_expression,
        'do',
        optional($.gtl_template_instruction_list),
        'end',
        'repeat'
      ),

      gtl_input_instruction: $ => seq(
        'input',
        $.gtl_argument_list
      ),

      gtl_argument_list: $ => seq(
        '(',
        optional(
          repeat1(
            seq(
              $.identifier_string,
              optional(
                seq(
                  ':',
                  '@',
                  $.identifier_string
                )
              ),
              optional(
                ','
              )
            )
          )
        ),
        ')'
      ),

      gtl_file_name: $ => choice(
        $.identifier_string,
        seq(
          'from',
          $.gtl_expression
        )
      ),

      // literal_enum: _ => repeat1(/[A-Za-z0-9_]/),
      literal_enum: _ => token(repeat1(/[A-Za-z0-9_]/)),

      // literal_enum: _ => /[A-Za-z0-9_]*/,

      literal_double: _ => {
        const separator = '\'';
        const hex = /[0-9a-fA-F]/;
        const decimal = /[0-9]/;
        const hexDigits = seq(repeat1(hex), repeat(seq(separator, repeat1(hex))));
        const decimalDigits = seq(repeat1(decimal), repeat(seq(separator, repeat1(decimal))));
        return token(seq(
          optional(/[-\+]/),
          optional(choice(/0[xX]/, /0[bB]/)),
          choice(
            seq(
              choice(
                decimalDigits,
                seq(/0[bB]/, decimalDigits),
                seq(/0[xX]/, hexDigits),
              ),
                optional(seq('.', optional(hexDigits))),
            ),
            seq('.', decimalDigits),
          ),
          optional(seq(
            /[eEpP]/,
            optional(seq(
              optional(/[-\+]/),
              hexDigits,
            )),
          )),
          /[uUlLwWfFbBdD]*/,
        ));
    },

      literal_char: $ => seq(
        choice('L\'', 'u\'', 'U\'', 'u8\'', '\''),
        repeat1(
          choice(
            $.escape_sequence,
            token.immediate(/[^\n']/)
          )
        )
      ),

      // identifier_string: _ => repeat1(/[A-Za-z0-9_]/),
      identifier_string: _ => token(repeat1(/[A-Za-z0-9_]/)),

      string: $ => choice(
            seq(
              '"',
              repeat(choice(
                alias($.unescaped_double_string_fragment, $.string_fragment),
                $.escape_sequence,
              )),
              '"',
            ),
            seq(
              '\'',
              repeat(choice(
                alias($.unescaped_single_string_fragment, $.string_fragment),
                $.escape_sequence,
              )),
              '\'',
            ),
          ),

      unescaped_double_string_fragment: _ => token.immediate(prec(1, /[^"\\\r\n]+/)),

      unescaped_single_string_fragment: _ => token.immediate(prec(1, /[^'\\\r\n]+/)),
      escape_sequence: _ => token.immediate(
        seq(
            '\\',
            choice(
              /[^xu0-7]/,
              /[0-7]{1,3}/,
              /x[0-9a-fA-F]{2}/,
              /u[0-9a-fA-F]{4}/,
              /u{[0-9a-fA-F]+}/,
              /[\r?][\n\u2028\u2029]/,
            ),
        )
      ),

      comment: _ => token(
          seq(
            '#',
            /.*/
          )
      )
  }
});
