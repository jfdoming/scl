export const GRAMMAR = {
	PROGRAM: [
		["PROGRAM_END"],
		["TERMINATOR", "PROGRAM"],
		["STATEMENT", "PROGRAM_NEXT"],
	],
	PROGRAM_NEXT: [
		["TERMINATOR", "PROGRAM"],
		["PROGRAM_END"],
	],
	STATEMENT: [["EXPRESSION"]],
	EXPRESSION: [
		["OPEN_PARENTHESIS", "EXPRESSION", "OPERATOR", "EXPRESSION", "CLOSE_PARENTHESIS"],
		["OPEN_PARENTHESIS", "EXPRESSION", "CLOSE_PARENTHESIS"],
		["FUNCTION"],
		["TERM"],
		["EXPRESSION", "OPERATOR", "EXPRESSION"],
	],
	OPERATOR: [
		["PLUS"],
		["MINUS"],
		["DIVIDE"],
		["POWER"],
		["MULTIPLY"],
	],
	FUNCTION: [
		["IDENTIFIER", "OPEN_PARENTHESIS", "EXPRESSION", "CLOSE_PARENTHESIS"],
	],
	TERM: [
		["NUMBER"],
		["MINUS", "NUMBER"],
		["IDENTIFIER"],
		["STRING"],
	],
	TERMINATOR: [["STMT_END"], ["NEWLINE"]],
};

export default GRAMMAR;