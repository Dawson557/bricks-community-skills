#!/usr/bin/env node
// Validates the Bricks Community skills package. Adapted from
// codeerhq/bricks-skills scripts/validate-package.mjs (GPL-2.0-or-later).
//
// Usage: node scripts/validate-package.mjs [--root <path>]

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Skill names in codeerhq/bricks-skills. A `bricks-*` name referenced here
// must be one of these. Update when Bricks adds or renames a skill.
export const BRICKS_SKILLS = [
	'bricks-agent-repository', 'bricks-ai-tab', 'bricks-audit-design-system', 'bricks-breakpoints',
	'bricks-browser-verify', 'bricks-child-theme-patterns', 'bricks-components', 'bricks-custom-code',
	'bricks-custom-controls', 'bricks-custom-dynamic-data-providers', 'bricks-custom-elements',
	'bricks-custom-fonts', 'bricks-design-systems', 'bricks-dynamic-data', 'bricks-element-conditions',
	'bricks-element-schemas', 'bricks-figma-to-bricks', 'bricks-forms', 'bricks-global-queries',
	'bricks-headers-footers', 'bricks-hooks-reference', 'bricks-html-css-to-bricks', 'bricks-import-export',
	'bricks-interactions', 'bricks-maintenance', 'bricks-media-assets', 'bricks-mega-menus',
	'bricks-naming-conventions', 'bricks-nestable-elements', 'bricks-performance', 'bricks-plan-from-brief',
	'bricks-popups', 'bricks-quality-gate', 'bricks-query-filters', 'bricks-query-loops',
	'bricks-role-permissions', 'bricks-seed-design-system', 'bricks-settings', 'bricks-sidebars',
	'bricks-site-audit', 'bricks-site-reproduction', 'bricks-skills-update', 'bricks-start-here',
	'bricks-templates-conditions', 'bricks-woocommerce',
]

// Backticked `bce-*` / `bricks-*` identifiers that are not skills.
const NOT_SKILLS = new Set([
	'bce-notifications-panel', // a removed Bricks element, named so agents stop looking for it
	'bce-skills-upgrade', 'bce-skills-update-check', // scripts in this package
	'bricks-community-skills', 'bricks-skills', // repository and marketplace names
	'bricks-ai', 'bricks-settings-page',
])

const walk = (directory) =>
	fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') {
			return []
		}
		const entryPath = path.join(directory, entry.name)
		return entry.isDirectory() ? walk(entryPath) : [entryPath]
	})

const parseScalar = (value, location) => {
	if (value.startsWith('"')) {
		try {
			return JSON.parse(value)
		} catch (error) {
			throw new Error(`${location}: invalid double-quoted YAML scalar (${error.message})`)
		}
	}
	if (value.startsWith("'")) {
		if (!value.endsWith("'") || value.length < 2) {
			throw new Error(`${location}: unterminated single-quoted YAML scalar`)
		}
		return value.slice(1, -1).replaceAll("''", "'")
	}
	return value
}

/** Parses the small YAML subset skill frontmatter uses: scalars and one level of lists. */
export const parseFrontmatter = (contents, relativePath) => {
	const normalized = contents.replaceAll('\r\n', '\n')
	if (!normalized.startsWith('---\n')) {
		throw new Error(`${relativePath}: missing opening frontmatter delimiter`)
	}
	const end = normalized.indexOf('\n---\n', 4)
	if (end === -1) {
		throw new Error(`${relativePath}: missing closing frontmatter delimiter`)
	}

	const result = {}
	let listKey = null
	for (const [index, line] of normalized.slice(4, end).split('\n').entries()) {
		const location = `${relativePath}:${index + 2}`
		if (/^\s*(?:#.*)?$/.test(line)) {
			continue
		}
		const item = line.match(/^\s+-\s+(.+)$/)
		if (item && listKey) {
			result[listKey].push(parseScalar(item[1], location))
			continue
		}
		const pair = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):(?:\s+(.*))?$/)
		if (!pair) {
			throw new Error(`${location}: unsupported frontmatter line`)
		}
		const [, key, scalar] = pair
		if (Object.hasOwn(result, key)) {
			throw new Error(`${location}: duplicate key ${key}`)
		}
		if (scalar === undefined) {
			result[key] = []
			listKey = key
		} else {
			result[key] = parseScalar(scalar, location)
			listKey = null
		}
	}
	return result
}

const extractLocalLinks = (contents) =>
	[...contents.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)]
		.map((match) => match[1].trim())
		.filter((target) => target && !/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target))
		.map((target) => decodeURIComponent(target.split('#')[0]))

export const validatePackage = ({ root = scriptRoot } = {}) => {
	const errors = []
	const fail = (message) => errors.push(message)
	const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')
	const skillsRoot = path.join(root, 'skills')

	const version = fs.existsSync(path.join(root, 'VERSION')) ? read('VERSION').trim() : ''
	if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
		fail(`VERSION is not valid SemVer: ${version || '<missing>'}`)
	}

	for (const jsonPath of walk(root).filter((filePath) => filePath.endsWith('.json'))) {
		try {
			JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
		} catch (error) {
			fail(`${path.relative(root, jsonPath)} is invalid JSON: ${error.message}`)
		}
	}

	let marketplace
	try {
		marketplace = JSON.parse(read('.claude-plugin/marketplace.json'))
	} catch (error) {
		fail(`marketplace.json cannot be read: ${error.message}`)
	}
	if (marketplace && marketplace.metadata?.version !== version) {
		fail(`marketplace version ${marketplace.metadata?.version ?? '<missing>'} does not match VERSION ${version}`)
	}

	const skillDirectories = fs.existsSync(skillsRoot)
		? fs.readdirSync(skillsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
		: []
	const known = new Set([...skillDirectories, ...BRICKS_SKILLS])

	for (const directory of skillDirectories) {
		const skillPath = path.join(skillsRoot, directory, 'SKILL.md')
		const relativeSkillPath = path.relative(root, skillPath).replaceAll('\\', '/')
		if (!fs.existsSync(skillPath)) {
			fail(`skills/${directory} has no SKILL.md`)
			continue
		}
		if (!/^bce-[a-z0-9-]+$/.test(directory)) {
			fail(`skills/${directory} does not use the bce- prefix`)
		}

		const contents = fs.readFileSync(skillPath, 'utf8')
		try {
			const metadata = parseFrontmatter(contents, relativeSkillPath)
			if (metadata.name !== directory) {
				fail(`${relativeSkillPath} name is ${metadata.name ?? '<missing>'}, expected ${directory}`)
			}
			if (typeof metadata.description !== 'string' || metadata.description.trim() === '') {
				fail(`${relativeSkillPath} has no description`)
			} else if (metadata.description.length > 1024) {
				fail(`${relativeSkillPath} description is ${metadata.description.length} characters (max 1024)`)
			}
		} catch (error) {
			fail(error.message)
		}

		for (const markdownPath of walk(path.join(skillsRoot, directory)).filter((filePath) => filePath.endsWith('.md'))) {
			const relativeMarkdownPath = path.relative(root, markdownPath).replaceAll('\\', '/')
			const markdown = fs.readFileSync(markdownPath, 'utf8')

			for (const [, name] of markdown.matchAll(/`((?:bce|bricks)-[a-z0-9]+(?:-[a-z0-9]+)*)`/g)) {
				if (!known.has(name) && !NOT_SKILLS.has(name)) {
					fail(`${relativeMarkdownPath} references unknown skill ${name}`)
				}
			}
			for (const target of extractLocalLinks(markdown)) {
				if (!fs.existsSync(path.resolve(path.dirname(markdownPath), target))) {
					fail(`${relativeMarkdownPath} links to missing local file ${target}`)
				}
			}
		}
	}

	const manifestSkills = (marketplace?.plugins?.[0]?.skills ?? []).map((skill) => skill.replace(/^\.\/skills\//, ''))
	for (const name of manifestSkills) {
		if (!skillDirectories.includes(name)) {
			fail(`marketplace.json lists ${name}, which has no folder in skills/`)
		}
	}
	for (const name of skillDirectories) {
		if (!manifestSkills.includes(name)) {
			fail(`skills/${name} is missing from marketplace.json`)
		}
	}

	if (fs.existsSync(path.join(root, 'README.md'))) {
		const readmeSkills = [...read('README.md').matchAll(/^\| \*\*(bce-[^*]+)\*\* \|/gm)].map((match) => match[1]).sort()
		if (JSON.stringify(readmeSkills) !== JSON.stringify(skillDirectories)) {
			fail('README skill table does not match skills/ directories')
		}
	} else {
		fail('README.md is missing')
	}

	return { errors, skillCount: skillDirectories.length, version }
}

const main = () => {
	const options = {}
	const argv = process.argv.slice(2)
	for (let index = 0; index < argv.length; index += 1) {
		const [flag, inlineValue] = argv[index].split('=', 2)
		if (flag !== '--root') {
			console.error(`ERROR: unknown argument ${argv[index]}`)
			process.exit(2)
		}
		const value = inlineValue ?? argv[++index]
		if (!value) {
			console.error('ERROR: --root requires a path')
			process.exit(2)
		}
		options.root = path.resolve(value)
	}

	const result = validatePackage(options)
	if (result.errors.length > 0) {
		for (const error of result.errors) {
			console.error(`ERROR: ${error}`)
		}
		process.exit(1)
	}
	console.log(`Validated ${result.skillCount} skills for ${result.version}.`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	main()
}
