<template>
<th
  class="sticky top-0 z-20 bg-[#1D3557] text-white text-xs uppercase font-semibold tracking-wide px-4 py-3 border-b border-[#457B9D] text-center whitespace-nowrap"
>

    <div class="flex items-center justify-center gap-1">
      <slot />
      <slot name="filter-icon" />
    </div>
  </th>
</template>
