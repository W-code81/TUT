export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
    uniqueId?: string | null, //optional prop for specifying data to a state/user
) {
    // unique storage identifier
    const storageKey = uniqueId
        ? `${key}:${uniqueId}`
        : key

    //  global state constant
    const state = useState<T>(storageKey, () => defaultValue)

    // getting state from localStorage
    onMounted(() => {
        const item = localStorage.getItem(storageKey)

        if (!item) return

        try {
            state.value = JSON.parse(item)
        } catch {
            localStorage.removeItem(storageKey)
        }
    })

    // syncing state to localStorage
    watch(
        state,
        value => {
            localStorage.setItem(storageKey, JSON.stringify(value))
        },
        { deep: true }
    )

    // for logging out
    const clear = () => {
        state.value = defaultValue
        localStorage.removeItem(storageKey)
    }

    return {
        value: state, //any value passed will become a state 
        clear,
    }
}