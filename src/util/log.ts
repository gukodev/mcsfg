const prefix = '[MCSkinFileGen]'
const VERBOSE = true

const log = {
    nl: () => {
        if (VERBOSE) console.log('')
    },
    info: (...args: any[]) => {
        if (VERBOSE) console.log(prefix, '(info)', ...args)
    },
    error: (...args: any[]) => {
        if (VERBOSE) console.log(prefix, '(error)', ...args)
    },
    warn: (...args: any[]) => {
        if (VERBOSE) console.log(prefix, '(warn)', ...args)
    },
}

export default log
