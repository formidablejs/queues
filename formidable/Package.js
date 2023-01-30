exports.Package = class Package {
    publish(language = 'imba') {
        const ext = language.toLowerCase() == 'imba'
            ? 'imba' : (
                language.toLowerCase() == 'typescript' ? 'ts' : 'imba'
            )

        return {
            config: {
                paths: {
                    [`./config/queue.${ext}`]: `./formidable/config.${ext}`
                }
            }
        }
    }
}