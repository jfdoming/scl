const tokenList = {
	NUMBER: "\\d+(?:\\.\\d*)?|\\d*\\.\\d+(?=$|[^0-9.])",
	STRING: "\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'",
	PLUS: "\\+",
	MINUS: "-",
	MULTIPLY: "\\*(?!\\*)",
	DIVIDE: "/",
	POWER: "\\*{2}|\\^",
	OPEN_PARENTHESIS: "\\(",
	CLOSE_PARENTHESIS: "\\)",
	WHITESPACE: "[ \\t]+",
	NEWLINE: "\\n|\\r",
	IDENTIFIER: "[a-zA-Z_][a-zA-Z0-9_]*",
	STMT_END: ";",
};

const MAP = Object.entries(tokenList);
const TOKENS = MAP.map((entry) => entry[0]);
TOKENS.push("PROGRAM_END"); // used to signify the end of a program
export {TOKENS};

export const tokenize = (input) => {
	if (!input) {
		return;
	}
	
	let stream = input;
	let lineNumber = 1;
	let tokens = [];
	while (stream) {
		const tokenMatch = MAP.reduce((found, entry) => {
			if (found) {
				return found;
			}

			// Check if the current token type matches.
			const match = new RegExp("^" + entry[1]).exec(stream);
			if (match && match.index == 0) {
				console.log(match[0] + " is a " + entry[0]);
				
				if (match[0].includes("\n")) {
					++lineNumber;
				}
				
				return [entry[0], match[0]];
			}

			return found;
		}, null);
		
		if (tokenMatch) {
			stream = stream.substring(tokenMatch[1].length);
			tokens.push(tokenMatch);
		} else {
			// No matching token found. We don't know what this character is!
			const line = stream.split("\n|\r|\r\n")[0];
			const fullLine = input.split("\n")[lineNumber - 1];
			const column = fullLine.length - line.length + 1;
			throw [fullLine, lineNumber, column];
		}
	}

	tokens.push(["PROGRAM_END", ""]);
	return tokens;
};

export default tokenize;
