<template>
  <div class="flex items-center justify-center join mt-8 mb-5">
    <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)" class="btn join-item">Anterior</button>

    <template v-for="(page, index) in pageNums" :key="index">
      <button v-if="Number.isInteger(page)" @click="goToPage(page)"
              :class="['join-item', 'btn', { 'btn-disabled': currentPage === page }]">
        {{ page }}
      </button>
      <span v-else class="join-item btn btn-disabled">{{ page }}</span>
    </template>

    <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)" class="btn join-item">Siguiente</button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    pageNums() {
      return paginate(this.currentPage, this.totalPages, 2);
    }
  },
  methods: {
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.$emit('page-changed', page);
    }
  }
};

function paginate(currentPage, totalPages, onSides = 2) {
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    let offset = (i == 1 || i == totalPages) ? onSides + 1 : onSides;
    if (i == 1 || (currentPage - offset <= i && currentPage + offset >= i) || i == currentPage || i == totalPages) {
      pages.push(i);
    } else if (i == currentPage - (offset + 1) || i == currentPage + (offset + 1)) {
      if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
  }
  return pages;
}
</script>