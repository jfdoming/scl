import tokenize from "/js/tokenize.mjs";
import parse from "/js/parse.mjs";
import simplify from "/js/simplify.mjs";
import execute from "/js/execute.mjs";

export const scl = {
	execute: (input, stdout) => {
		console.log("Executing...");
		let tokens;
		try {
			tokens = tokenize(input);
		} catch (e) {
			if (e.length && e.length > 2) {
				const line1Prefix = `(lexer) Unrecognized token at line ${e[1]}, column ${e[2]}: `;
				const line1 = line1Prefix + e[0];
				const line2 = " ".repeat(line1Prefix.length + e[2] - 1) + "^";
				console.log(`%c${line1}`, "background: red; color: white;");
				console.log(`%c${line2}`, "background: red; color: white;");
				throw {
					source: "lexer",
					message: [
						line1,
						line2,
					]
				};
			} else {
				console.error(e);
			}
		}

		const tree = simplify(parse(tokens));
		console.log(tree);
		execute(tree, stdout);
	},
};

export default scl;
