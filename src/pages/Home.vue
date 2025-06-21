<script setup>
import { ref, watchEffect } from "vue";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/auth";
import TextInput from "./../components/Auth/TextInput.vue";
import InputLabel from "./../components/Auth/InputLabel.vue";

const authStore = useAuthStore();

const theme = ref(localStorage.getItem('theme') || 'light');
const isChecked = ref(theme.value === 'dark');

const handleToggle = () => {
  isChecked.value = !isChecked.value;
  theme.value = isChecked.value ? 'dark' : 'light';
};

const form = ref({
  email: "",
  password: "",
});

const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};


const handleLogin = async () => {
  const success = await authStore.signIn(form.value); // .value para acceder al ref

  if (success) {
    Swal.fire({
      icon: "success",
      title: "Bienvenido",
      text: "Inicio de sesión exitoso",
      timer: 2000,
      showConfirmButton: false,
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Error al iniciar sesión",
      text: "Credenciales incorrectas o error del servidor",
    });
  }
};

watchEffect(() => {
  localStorage.setItem("theme", theme.value);
  document.querySelector("html").setAttribute("data-theme", theme.value);
});
</script>


<template>
  <!-- Toggle DarkMode -->
  <div class="absolute top-3 right-4 z-50">
    <label class="flex cursor-pointer gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
      <input 
          type="checkbox"
          @change="handleToggle"
          :checked="isChecked"
          class="toggle theme-controller"
      />
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    </label>
  </div>
  <!-- Toggle DarkMode -->

  <main class="h-dvh w-full bg-gray-200 dark:bg-woodsmoke-950 transition-colors duration-300 ease-out">
    <section class="container mx-auto h-full w-full lg:max-w-6xl py-12">
      <div class="flex h-full w-full bg-white dark:bg-woodsmoke-900 transition-colors duration-300 ease-out rounded-xl shadow-lg overflow-hidden">
        <!-- Imagen representativa -->
        <div class="hidden lg:block h-full w-1/2">
          <figure class="h-full w-full">
            <img src="/public/uninterlogo.png" alt="logo-uninter" class="w-full h-full object-cover" />
          </figure>
        </div>
        <!-- Formulario -->
        <div class="h-full w-full lg:w-1/2">
          <div class="flex flex-col items-center justify-center h-full w-full py-8">
            <div class="my-10">
              <div class="flex justify-center w-full pb-6">
                <figure class="block lg:hidden w-28 h-28">
                  <img src="/public/Uninter - Logo (Responsive).png" alt="logo-uninter" />
                </figure>
              </div>
              <h2 class="text-black dark:text-white text-center text-lg md:text-2xl font-bold uppercase transition-colors duration-300 ease-out">
                Inicio de sesión
              </h2>
              <h1 class="mt-2 text-center text-base md:text-lg font-semibold text-elephant-900 dark:text-regal-blue-500 lg:dark:text-elephant-400 transition-colors duration-300 ease-out">
                Sistema Integral de Control y Eficiencia en Leads.
              </h1>
            </div>

            <div class="w-full max-w-xs md:max-w-xl lg:max-w-md">
<form @submit.prevent="handleLogin">
  <div>
    <InputLabel for="email" value="Correo Electrónico" />
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
        📧
      </span>
      <TextInput 
        id="email" 
        v-model="form.email" 
        type="email" 
        class="pl-10 mt-1 block w-full"
        placeholder="Ingrese su correo electrónico" 
        autofocus 
        autocomplete="email" 
      />
    </div>
  </div>

  <div class="mt-4">
    <InputLabel for="password" value="Contraseña" />
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
        🔒
      </span>
      <TextInput 
        id="password" 
        v-model="form.password" 
        :type="showPassword ? 'text' : 'password'" 
        class="pl-10 mt-1 block w-full"
        placeholder="Ingrese su contraseña" 
      />
      <button
        type="button"
        @click="togglePassword"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
        tabindex="-1"
      >
        {{ showPassword ? '🙈' : '👁️' }}
      </button>
    </div>
  </div>

  <div class="flex mt-10">
    <button 
      type="submit"
      class="inline-block py-3 w-full text-white bg-regal-blue-900 hover:bg-regal-blue-950 lg:bg-fiord-700 lg:hover:bg-fiord-800 lg:dark:hover: rounded-3xl duration-200"
    >
      Iniciar Sesión
    </button>
  </div>
</form>

            </div>
          </div>
        </div>
      </div>

      <!-- Copyrigth -->
      <footer class="flex justify-center w-full h-fit py-3">
        <h5 class="text-black dark:text-white text-sm font-semibold transition-colors duration-300 ease-out">
          © {{ new Date().getFullYear() }} - Universidad Internacional.
        </h5>
      </footer>
    </section>
  </main>
</template>
