import { generateClasses } from "@formkit/themes"

const config = {
    config: {
        classes: generateClasses({
            global: {
                wrapper: 'space-y-2 mb-3',
                message: 'text-red-500 text-sm my-3',
                label: 'block font-medium text-sm text-gray-700 dark:text-white mb-2 transition-colors duration-300 ease-out',
                input: 'bg-white w-full p-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-700'
            },
            submit: {
                input: '$reset mt-10 px-4 py-2 w-full text-white border border-green-500 bg-green-500 group hover:bg-green-600 active:bg-green-500 active:border-green-500 rounded-lg duration-300'
            },
        })
    }
}

export default config;