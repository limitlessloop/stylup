import _ from 'lodash'

// This function generates new regexes in an object by replacing token identifiers with their regex counterparts

function generateRegex() {

	let tokens = {
		property: /m|w|p/,
		number: /[0-9]*\.?[0-9]+/,
		unit: /px/,
		seperator: /,/,
		arg: /0*(<number>)(<unit>)?/,
		args: /(?:(<arg>)<seperator>?)+/,
		decl: /(<property>)-(<args>)/
	}

	// Define what a token identifier looks like <word>
	let token = /<(\w+)>/gmi

	// Takes regex like /\d\w[0-9]<word>/ and replaces token identifier with matching token name
	function replaceTokenIdent(value, tokens) {

		return value.toString().replace(token, function(match, name) {

			if (tokens[name]) {
				if (tokens[name].toString().match(token)) {
					return replaceTokenIdent(tokens[name], tokens)
				}
				return tokens[name].source
			}
			else {
				return match
			}
		})
	}

	// Go through each token in object and replace tokens identifier with value
	tokens = _.reduce(tokens, function(result, value, key) {
		return {
			...result,
			[key]: replaceTokenIdent(value, tokens),
			}
	}, {})

	// Create new regex for each token
	return _.reduce(tokens, function(result, value, key) {
		return {
			...result,
			[key]: new RegExp (value.replace(/\//g, ''), 'gmi'),
		  }
	}, {})
}

export default generateRegex()
