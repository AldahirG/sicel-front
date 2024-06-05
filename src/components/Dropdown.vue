<template>
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn rounded-full m-1 bg-gray-300 dark:bg-[#14191E]">
            <i class="bi bi-three-dots rotate-90"></i>
        </div>

        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-gray-300 dark:bg-[#14191E] rounded-box w-52 gap-2">
            <slot />
        </ul>
    </div>
</template>